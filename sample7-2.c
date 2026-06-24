#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#define pi 3.1415926535
/*
    rotatearray, scalearray関数を定義してください
    前者は２次元平面を回転することで平面上の点を移動します。
    後者はx,y座標を与えられた比率で伸縮します。
*/
void rotatearray(float *position, float rotate)
{
    float X,Y;
    float cos1,sin1; 
    cos1= (float)(cos(rotate*pi/180));
    sin1=(float)(sin(rotate*pi/180));
    X=position[0]*cos1-position[1]*sin1;
    Y=position[0]*sin1+position[1]*cos1;

    position[0]=X;
    position[1]=Y;
}

void scalearray(float *position, float scale)
{
    float X,Y;
    X=position[0]*scale;
    Y=position[1]*scale;
    position[0]=X;
    position[1]=Y;
}




/*
    main関数は変更しないこと
*/
int main(int argc, char *argv[]){
    float position[2],rotate,scale;
    
    if(argc!=5){
        printf("Error\n");
        return 1;
    }
    
    position[0]=atof(argv[1]);
    position[1]=atof(argv[2]);
    rotate=atof(argv[3]);
    scale=atof(argv[4]);

    printf("(%.2f,%.2f)\n",position[0],position[1]);
    printf("rotate:%.2f degree\n",rotate);
    printf("scale:%.2f\n",scale);

    rotatearray(position,rotate);

    scalearray(position,scale);

    printf("(%.2f,%.2f)\n",position[0],position[1]);


    return 0;   
}