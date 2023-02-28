---
title: pnp 算法求解
urlname: pnp_solve_theory
categories:      
    vision    
tags: [vision,calibration,Algorithm]
date: 2023-02-18 12:49:21
---

# 引言（未完）

PNP问题的描述以及定义是相对简单的，他的目的就是<u>求解3D-2D点对运动的方法</u>。简单来说，就是 <big>在已知n个三维空间点坐标（相对于某个指定的坐标系A）及其二维投影位置的情况下，如何估计相机的位姿（即相机在坐标系A下的姿态）</big>。

举个例子，我们在一幅图像中，知道其中至少四个图像中确定的点在3D空间下的相对坐标位置，我们就可以估计出相机相对于这些点的姿态，或者说估计出这些3D点在相机坐标系下姿态。（上述说的姿态或者位姿，包括位置以及方向，即一个6自由度的状态）[ $^{[1.]}$ ](https://www.jianshu.com/p/b3e9fb2ad0dc)

PnP 问题有很多种求解方法，例如用三对点估计位姿的 P3P 、直接线性变换(DLT)、EPnP、SDP、UPnP。此外,还能用非线性优化的方式,构建最小二乘问题并迭代求解,也就是万金油式的 Bundle Adjustment[ $^{[2.]}$ ](https://blog.csdn.net/u014709760/article/details/88029841)。

- [x] Edit By Porter, 积水成渊,蛟龙生焉。 
- [x] Insert Date String 插件，ctrl+shift+I 插入时间字符串

<!-- more -->

# pnp 求解过程

Perspective-n-Point问题(PnP)的已知条件：

- n个世界坐标系中的3D参考点(3D reference points)坐标;
- 与这n个3D点对应的、投影在图像上的2D参考点(2D reference points)坐标;
- 摄像头的内参K KK;
- 求解PnP问题可以得到摄像头的位姿。

 OpenCV中提供了solvePnP函数可以直接求解出旋转矩阵和平移矩阵。

## pnp 求解原理

对于视觉里程计中，相机位姿的求解问题极为常见。对于双目相机，由于其可以直接计算出深度信息，所以在相机位姿求解上十分容易。但如果我们使用的是单目相机，如何从二维图像中求解出相机相对三维物体的位姿就需要一定的算法来完成[ $^{[7.]}$ ](https://juejin.cn/post/7099347146775724069)。

### 直接线性变换(DLT) [ $^{[8.]}$ ](https://zhuanlan.zhihu.com/p/76047709) [ $^{[9.]}$ ](https://blog.csdn.net/b5w2p0/article/details/8804216)




### P3P
  






### EPnP



### SDP



### UPnP



## opencv 中solvepnp函数求解变换矩阵的demo [ $^{[4.]}$ ](https://blog.csdn.net/Rosen_er/article/details/119953502)

```c++
//定义世界坐标和图像坐标
vector<Point3d> World_Coor = {Point3f(0, 0, 0), Point3f(0, 26.5, 0), Point3f(67.5, 26.5, 0), Point3f(67.5, 0, 0)};
//传入图像坐标
vector<Point2d> Img_Coor;
Img_Coor.push_back(featrue[i].bl());
Img_Coor.push_back(featrue[i].tl());
Img_Coor.push_back(featrue[i].tr());
Img_Coor.push_back(featrue[i].br());
//pnp解算
solvePnP(objectSmallArmor, img_points, cameraMatrix, distcoeff, rvec, tvec, false, SOLVEPNP_IPPE);
Rodrigues(rvec, R_rvec);
// 转换格式
R_rvec.convertTo(R_rvec, CV_64FC1);
tvec.convertTo(tvec, CV_64FC1);
// 转成Eigen下的矩阵
Eigen::Matrix3f Rotated_matrix;
Eigen::Vector3f Tran_vector;
cv2eigen(R_rvec, Rotated_matrix);
cv2eigen(tvec, Tran_vector);

//计算欧拉角
Eigen::Vector3f euler_angles = Rotated_matrix.eulerAngles(0, 1, 2);

picth = euler_angles[0] * 180 / PI;
yaw = euler_angles[1] * 180 / PI;
roll = euler_angles[2] * 180 / PI;

//计算距离
distance = (COEFF_K * sqrt(Tran_vector.transpose() * Tran_vector) + COEFF_B) * cosf(pitch * PI / 180.f);
```



# 参考文献

[1. PNP(pespective-n-point)算法学习笔记](https://www.jianshu.com/p/b3e9fb2ad0dc)

[2. 3D-2D：PnP算法原理](https://blog.csdn.net/u014709760/article/details/88029841)

[3. 深入EPnP算法](https://blog.csdn.net/jessecw79/article/details/82945918#_138)

[4. 单目相机位姿求解之PNP算法原理剖析与实践](https://blog.csdn.net/Rosen_er/article/details/119953502)

[5. EPro-PnP: Generalized End-to-End Probabilistic Perspective-n-Points for Monocular Object Pose Estimation](https://readpaper.com/paper/4605324801770266625/questions-detail?questionId=534901540122656770)

[6. 【论文笔记】—目标姿态估计—EPro-PnP—2022-CVPR](https://blog.csdn.net/qq_39751352/article/details/125968948)

[7. 单目相机位姿求解之PNP算法原理剖析与实践](https://juejin.cn/post/7099347146775724069)

[8. 直接线性变换DLT](https://zhuanlan.zhihu.com/p/76047709)

[9. 双目视觉算法研究（二）相机模型和直接线性法（DLT）](https://blog.csdn.net/b5w2p0/article/details/8804216)

[5. 《slam十四讲》中的视觉里程计一章]()

<iframe src="//player.bilibili.com/player.html?aid=59593514&bvid=BV16t411g7FR&cid=103818657&page=7" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
