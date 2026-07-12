import os
from PIL import Image
from transformers import pipeline
import subprocess

class ImageAnalyzer:
    def __init__(self, model_name="google/vit-base-patch16-224"): # 適切なモデル名を指定
        self.image_classifier = pipeline("image-classification", model=model_name)

    def analyze_image(self, image_path: str) -> list[str]:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found at {image_path}")
        
        # 画像ファイルの拡張子をチェックし、必要であれば変換する
        base, ext = os.path.splitext(image_path)
        if ext.lower() not in ['.jpg', '.jpeg', '.png']:
            print(f"Unsupported image format: {ext}. Attempting conversion.")
            output_path = f"{base}.jpg"
            try:
                # ImageMagickを使用して画像を変換
                # このコマンドは、システムにImageMagickがインストールされていることを前提とします
                subprocess.run(['convert', image_path, output_path], check=True)
                image_path = output_path
            except subprocess.CalledProcessError as e:
                print(f"Error converting image: {e}")
                return []
            except FileNotFoundError:
                print("ImageMagick 'convert' command not found. Please install ImageMagick.")
                return []

        try:
            image = Image.open(image_path)
            results = self.image_classifier(image)
            tags = [result['label'] for result in results if result['score'] > 0.7]
            return tags
        except Exception as e:
            print(f"Error analyzing image: {e}")
            return []

if __name__ == "__main__":
    # この部分は実際のアプリケーションでは使用されず、テスト用です。
    # テスト用の画像ファイルパスを指定してください。
    test_image_path = "./test_image.gif" 
    
    # ダミーの画像ファイルを作成 (テスト用)
    try:
        img = Image.new('RGB', (60, 30), color = 'blue')
        img.save(test_image_path)
        print(f"Dummy image created at {test_image_path}")

        analyzer = ImageAnalyzer()
        tags = analyzer.analyze_image(test_image_path)
        print(f"Detected tags for {test_image_path}: {tags}")
    except Exception as e:
        print(f"Test setup failed: {e}")
    finally:
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
            print(f"Cleaned up dummy image at {test_image_path}")
