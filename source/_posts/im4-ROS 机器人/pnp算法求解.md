---
title: pnp 算法求解
urlname: pnp_solve_theory
categories:      
    vision    
tags: [vision,calibration,Algorithm]
date: 2023-02-18 12:49:21
---

# 引言

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

此部分按照《视觉slam十四讲》做了个笔记，直接线性变换仅仅需要6对3d-2d匹配点，即可求解出相机3d到2d的 $R| t$ 矩阵。

考虑空间一点 $P=(X,Y,Z,1)^{T}$。 在图像 $I_{1}$ 中投影到图像特征点 $x_{1}=(u_{1}, v_{1}, 1)^{T}$ （以归一化平面齐次坐标表示）。我们需要求解相机位姿 $R,t$ ，与单应矩阵的求解类似，我们定义增广矩阵 $[R|T]$ 为一个3x4的矩阵，包含了旋转平移信息。将其展开如下形式

$$
\begin{pmatrix}
u_{1} \\
v_{1} \\
1
\end{pmatrix}

=\begin{pmatrix}
t_{1}  &t_{2}  & t_{3} & t_{4}\\
t_{5}  &t_{6}  & t_{7} & t_{8}\\
t_{9}  &t_{10}  &t_{11}  &t_{12}
\end{pmatrix}
\begin{pmatrix}
X \\
Y \\
Z \\
1
\end{pmatrix}
$$

用最后一行把s消除掉，得到两个约束(一对特征点，对应两个约束)

$u_{1} = \frac{t_{1}X + t_{2}Y+t_{3}Z+t_{4}}{t_{9}X+t_{10}Y+t_{11}Z+t_{12}}$

$v_{1} = \frac{t_{5}X + t_{6}Y+t_{7}Z+t_{8}}{t_{9}X+t_{10}Y+t_{11}Z+t_{12}}$

为了简化表示，定义 $T$ 的行向量

$\mathbf{t}_{1} = (t_{1}, t_{2}, t_{3}, t_{4})^{T}$

$\mathbf{t}_{2} = ( t_{5}, t_{6},t_{7}, t_{8})^{T}$

$\mathbf{t}_{3} = ( t_{9},t_{10},t_{11},t_{12})^{T}$

于是有

$\mathbf{t}_{1}^{T} P - t_{3}^{T} P u_{1} = 0,$

$\mathbf{t}_{2}^{T} P - t_{3}^{T} P v_{1} = 0$

请注意 $\mathbf{t}$是待求变量，可以看到，每个特征点提供两个关于 $\mathbf{t}$ 的线性约束，假设一共存在N对特征点，则可以列出如下线性方程：

$\begin{pmatrix}
 P_{1}^{T}  &0  &-u_{1}P_{1}^{T} \\
0  &P_{1}^{T}  &-v_{1}P_{1}^{T}  \\
...  &....  &... \\
P_{N}^{T}  &0  &-u_{N}P_{1}^{T} \\
0  &P_{N}^{T}  &-v_{N}P_{1}^{T}
\end{pmatrix}$

于是6对特诊点，即可得到12组方程式，正好对应12个待求变量 $\mathbf{t}$ 直接求解即可得到变量值。这种方法称为DLT。

直接求解中，当匹配点对大于6个点时， 也可以用SVD [ $^{[11.]}$ ](https://zhuanlan.zhihu.com/p/36546367#:~:text=SVD%20%E5%85%A8%E7%A7%B0%EF%BC%9ASingular%20Value,Decomposition%E3%80%82.%20SVD%20%E6%98%AF%E4%B8%80%E7%A7%8D%E6%8F%90%E5%8F%96%E4%BF%A1%E6%81%AF%E7%9A%84%E5%BC%BA%E5%A4%A7%E5%B7%A5%E5%85%B7%EF%BC%8C%E5%AE%83%E6%8F%90%E4%BE%9B%E4%BA%86%E4%B8%80%E7%A7%8D%E9%9D%9E%E5%B8%B8%E4%BE%BF%E6%8D%B7%E7%9A%84%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3%E6%96%B9%E5%BC%8F%EF%BC%8C%E8%83%BD%E5%A4%9F%E5%8F%91%E7%8E%B0%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%8D%81%E5%88%86%E6%9C%89%E6%84%8F%E6%80%9D%E7%9A%84%E6%BD%9C%E5%9C%A8%E6%A8%A1%E5%BC%8F%E3%80%82.%20%E7%9F%A9%E9%98%B5%E5%BD%A2%E5%BC%8F%E6%95%B0%E6%8D%AE%EF%BC%88%E4%B8%BB%E8%A6%81%E6%98%AF%E5%9B%BE%E5%83%8F%E6%95%B0%E6%8D%AE%EF%BC%89%E7%9A%84%E5%8E%8B%E7%BC%A9%E3%80%82.)等方法对超定方程求最小二乘解。

### P3P
  
可以参考前面一篇双目相机标定的文章，以及slam 十四讲里面的介绍。





### EPnP [ $^{[12.]}$ ](https://zhuanlan.zhihu.com/p/361791835)

与其他方法相比，EPnP方法的复杂度为O(n)，对于点对数量较多的PnP问题，非常高效。

核心思想是将3D点表示为4个控制点的组合，优化也只针对4个控制点，所以速度很快，在求解 
$Mx=0$ 时，最多考虑了4个奇异向量，因此精度也很高。

### AP3P

参考 opencv 的官方介绍 [ $^{[13.]}$ ](https://docs.opencv.org/4.x/d5/d1f/calib3d_solvePnP.html#calib3d_solvePnP_flags)

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

[10. 《slam十四讲》中的视觉里程计一章]()

[11. SVD-矩阵奇异值分解 —— 原理与几何意义](https://zhuanlan.zhihu.com/p/36546367#:~:text=SVD%20%E5%85%A8%E7%A7%B0%EF%BC%9ASingular%20Value,Decomposition%E3%80%82.%20SVD%20%E6%98%AF%E4%B8%80%E7%A7%8D%E6%8F%90%E5%8F%96%E4%BF%A1%E6%81%AF%E7%9A%84%E5%BC%BA%E5%A4%A7%E5%B7%A5%E5%85%B7%EF%BC%8C%E5%AE%83%E6%8F%90%E4%BE%9B%E4%BA%86%E4%B8%80%E7%A7%8D%E9%9D%9E%E5%B8%B8%E4%BE%BF%E6%8D%B7%E7%9A%84%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3%E6%96%B9%E5%BC%8F%EF%BC%8C%E8%83%BD%E5%A4%9F%E5%8F%91%E7%8E%B0%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%8D%81%E5%88%86%E6%9C%89%E6%84%8F%E6%80%9D%E7%9A%84%E6%BD%9C%E5%9C%A8%E6%A8%A1%E5%BC%8F%E3%80%82.%20%E7%9F%A9%E9%98%B5%E5%BD%A2%E5%BC%8F%E6%95%B0%E6%8D%AE%EF%BC%88%E4%B8%BB%E8%A6%81%E6%98%AF%E5%9B%BE%E5%83%8F%E6%95%B0%E6%8D%AE%EF%BC%89%E7%9A%84%E5%8E%8B%E7%BC%A9%E3%80%82.)

[12. EPnP原理与源码详解](https://zhuanlan.zhihu.com/p/361791835)

[13. Perspective-n-Point (PnP) pose computation](https://docs.opencv.org/4.x/d5/d1f/calib3d_solvePnP.html#calib3d_solvePnP_flags)

<iframe src="//player.bilibili.com/player.html?aid=59593514&bvid=BV16t411g7FR&cid=103818657&page=7" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
