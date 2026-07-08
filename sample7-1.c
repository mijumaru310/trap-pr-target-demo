#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/* bsort関数のみを変更してください */


void printarray(int *array, int num){
/*
    要素数numの配列を表示します
*/
    int i;
    printf("\n <printarray>\n");

    for(i=0;i<num;i++){
        printf("%d ",*(array+i));
    }

    printf("\n");
}

void bsort(int *array, int num, int mode){
/*
    バブルソートを実行します
    array:入れ替えるべき配列へのポインタ
    num:配列の要素数
    mode:0で昇順、1で降順
*/

    printf("Sorting started...\n");
    // 進捗表示のためのカウンタを初期化
    int progress_interval = (num > 10) ? (num / 10) : 1; // 10%刻み、または最低1ステップ
    int next_progress_step = progress_interval;

    for(int i=0;i<num;i++) // ループ回数を調整
    {
        for(int j=num-1;j>i;j--)
        {
            if(mode==0){
                //昇順バブル
                if(*(array+j)<*(array+j-1)){
                    int p;
                    p=*(array+j);
                    *(array+j)=*(array+j-1);
                    *(array+j-1)=p;
                }

            }else if(mode==1){
                //降順バブル
                if(*(array+j)>*(array+j-1)){
                    int p;
                    p=*(array+j);
                    *(array+j)=*(array+j-1);
                    *(array+j-1)=p;
                }

            }else{
                printf("Error: Invalid mode\n");
                // エラー発生時もソートを続行させる
            }
        }
        // 進捗表示の更新
        if (i >= next_progress_step) {
            printf("Progress: %d%%\n", (i * 100 / num));
            next_progress_step += progress_interval;
        }
    }
    printf("Sorting finished.\n");
}

int main(void){
    int i,array[100];

	srand(time(NULL));

    printf("昇順:\n");

    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    printarray(array,100);

    bsort(array,100,0);

    printarray(array,100);

    printf("降順:\n");

    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    printarray(array,100);

    bsort(array,100,1);

    printarray(array,100);

    return 0;
}
