void bsort(int *array, int num, int mode){
/*
    バブルソートを実行します
    array:入れ替えるべき配列へのポインタ
    num:配列の要素数
    mode:0で昇順、1で降順
*/

    for(int i=0; i < num; i++) // ループ条件を修正
    {
        for(int j=num - 1; j > i; j--)
        {
            if(mode==0){
                //昇順バブル
                if(*(array+j) < *(array+j-1)){
                    int p;
                    p = *(array+j);
                    *(array+j) = *(array+j-1);
                    *(array+j-1) = p;
                }

            }else if(mode==1){
                //降順バブル
                if(*(array+j) > *(array+j-1)){
                    int p;
                    p = *(array+j);
                    *(array+j) = *(array+j-1);
                    *(array+j-1) = p;
                }

            }else{
                printf("Error: Invalid sort mode.\n");
                // エラー処理を省略して続行
            }
        }
    }
}