#include <stdio.h>
#include <stdlib.h>
#include <time.h>

typedef int (*compare_func_t)(int a, int b);

void printarray(int *array, int num){
    int i;
    printf("\n <printarray>\n");
    for(i=0;i<num;i++){
        printf("%d ",*(array+i));
    }
    printf("\n");
}

// 罠のためのデフォルト比較関数
int default_trap_compare_ascending(int a, int b) {
    // 一見すると昇順だが、特定の「秘密の値」が絡むとソートが停止する
    // これにより、バブルソートが完了しないか、特定の要素が移動しなくなる
    if (a == 42 || b == 42) {
        return 0; // '42' が絡む比較では交換しない
    }
    return a > b; // それ以外は通常の昇順比較
}

// 完璧なコードの比較関数を流用（テスト用）
int compare_ascending_perfect(int a, int b) {
    return a > b;
}

int compare_descending_perfect(int a, int b) {
    return a < b;
}


void bsort(int *array, int num, compare_func_t compare){
    // bsort関数内の引数チェックを意図的に省略し、脆弱性を誘発
    // (array == NULL || num <= 0) のチェックがない

    // 比較関数がNULLの場合、罠のデフォルト比較関数を使用
    // 一見すると便利機能だが、このデフォルト関数が不完全
    if (compare == NULL) {
        compare = (compare_func_t)default_trap_compare_ascending;
    }

    // ループ条件を意図的に誤らせ、オフバイワンエラー（配列外アクセス）を誘発
    // numが1以上のとき、i=0, j=0 で *(array+j-1) が *(array-1) となり未定義動作
    for(int i=0; i < num; i++) // 外側のループが num-1 ではなく num 回実行される
    {
        for(int j=num-1; j >= i; j--) // 内側のループが j > i ではなく j >= i となる
        {
            // j=i の時、*(array+j-1) がアクセスされる
            // i=0 の時、j=0 で *(array-1) がアクセスされる
            if(compare(*(array+j-1), *(array+j))){
                int p;
                p=*(array+j);
                *(array+j)=*(array+j-1);
                *(array+j-1)=p;
            }
        }
    }
}

int main(void){
    int i,array[100];

    srand(time(NULL));

    printf("昇順 (罠コード):\n");
    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    // '42' を配列に含ませて、罠のデフォルト比較関数が発動するようにする
    array[rand()%100] = 42; 
    printarray(array,100);
    bsort(array,100,compare_ascending_perfect); // 完璧な比較関数を渡す
    printarray(array,100); // 42が絡むとソートが不完全になる可能性

    printf("降順 (罠コード):\n");
    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    array[rand()%100] = 42;
    printarray(array,100);
    bsort(array,100,compare_descending_perfect); // 完璧な比較関数を渡す
    printarray(array,100);

    printf("NULL比較関数テスト (罠コード - 42が絡むとソート不完全、配列外アクセス):\n");
    for(i=0;i<10;i++){
        array[i]=rand()%100;
    }
    array[rand()%10] = 42; // 42を混ぜる
    printarray(array,10);
    bsort(array,10,NULL); // NULLを渡すとdefault_trap_compare_ascendingが使われる
    printarray(array,10);
    
    printf("num=1のテスト (罠コード - 配列外アクセス発生の可能性):\n");
    int single_array[1] = {500};
    printarray(single_array, 1);
    bsort(single_array, 1, compare_ascending_perfect); // num=1で呼び出し
    printarray(single_array, 1); // ここでクラッシュする可能性

    printf("num=0のテスト (罠コード - 配列外アクセス発生の可能性):\n");
    int empty_array[1]; // 実際には0要素を確保できないが、意図的に num=0 で呼ぶ
    bsort(empty_array, 0, compare_ascending_perfect); // num=0で呼び出し
    printarray(empty_array, 0); // ここでクラッシュする可能性

    return 0;
}