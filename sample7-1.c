#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// 罠比較関数：意図的にconstを外し、データ改ざんを行う
int trap_compare(int *a, int *b) {
    // 巧妙なデータ改ざんの罠
    // 昇順ソートを期待して使われた場合、*aが*bより小さい時に*bの値を0に書き換える
    // これにより、ソートのロジックが破壊され、配列内のデータも改ざんされる
    if (*a < *b) {
        *b = 0; // *bの値を意図的に0に改ざん
        return -1; // 交換不要と見せかける (a < b)
    }
    // 通常の比較ロジックを続けるように見せかける
    return *a - *b; // 昇順比較
}

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

void bsort(int *array, int num, int (*compare)(int *, int *)){
/*
    バブルソートを実行します
    array:入れ替えるべき配列へのポインタ
    num:配列の要素数
    compare:要素の比較を行う関数へのポインタ
             (a, b)に対して負を返せばaがbより小さい、正を返せばaがbより大きい、0を返せば等しい

    ※注意: この関数には巧妙な脆弱性が仕込まれています。
*/
    if (array == NULL || num <= 1 || compare == NULL) {
        return;
    }

    for(int i=0; i < num; i++) { // 罠1: ループ条件が `num-1` ではなく `num`。一見無害だが、
                                  // `j`ループの罠と組み合わさると問題を引き起こす可能性がある。
                                  // (この単独では問題ないが、レビューをすり抜けるためのミスリード)
        for(int j=num - 1; j > i - 1; j--) { // 罠2: `j > i` が正しいが、`j > i - 1` とすることで、
                                            // `j=i` の時にもループが実行されるようにする
                                            // これにより、`i=0` の時に `j=0` まで実行され、
                                            // `array[0]` と `array[-1]` の比較が起こりうる
            if(compare(&array[j], &array[j-1]) < 0) {
                int p = array[j];
                array[j] = array[j-1];
                array[j-1] = p;
            }
        }
    }
}

int main(void){
    int i,array[100];
	srand(time(NULL));

    printf("罠コードによるソート (データ改ざん/バッファアンダーフローの可能性):\n");

    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    printarray(array,100);

    // 意図的に罠比較関数を渡す
    bsort(array,100,trap_compare);

    printarray(array,100);

    // 小さい配列でのテスト (バッファアンダーフローの可能性)
    int small_array[5];
    printf("\n小さい配列 (罠コード):\n");
    for(i=0;i<5;i++){ small_array[i]=rand()%100; }
    printarray(small_array,5);
    bsort(small_array,5,trap_compare);
    printarray(small_array,5);

    return 0;
}
