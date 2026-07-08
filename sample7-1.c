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

    // ソート回数を配列の要素数に合わせる
    for(int i=0;i<num;i++) // 外側のループはnum回繰り返す
    {
        // 内側のループは未ソート部分を対象
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
                printf("Error\n");
                
            }

        }


    }



}

int main(void){
    int i,array[100];

	srand(time(NULL));

    printf("昇順:");

    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    printarray(array,100);

    bsort(array,100,0);

    printarray(array,100);

    printf("降順:");

    for(i=0;i<100;i++){
        array[i]=rand()%1000;
    }
    printarray(array,100);

    bsort(array,100,1);

    printarray(array,100);

    return 0;
}
