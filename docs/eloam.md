# 高拍仪
## 1.

- **品牌与型号：eloam S620A3DR**

- **官方热线：** 400 0982 858

- **产品页：**[http://www.eloam.cn/chanpin/S620A3D.html](http://www.eloam.cn/chanpin/S620A3D.html "http://www.eloam.cn/chanpin/S620A3D.html")

- **应用软件下载：**[http://www.eloam.cn/down/gujian/](http://www.eloam.cn/down/gujian/ "http://www.eloam.cn/down/gujian/")

- **驱动下载地址：**[http://www.eloam.cn/down/qudong/](http://www.eloam.cn/down/qudong/ "http://www.eloam.cn/down/qudong/")

- **控件下载地址：**[http://www.eloam.cn/down/kaifa/](http://www.eloam.cn/down/kaifa/ "http://www.eloam.cn/down/kaifa/")

- **Q&A:**[http://www.eloam.cn/about/about-267.html](http://www.eloam.cn/about/about-267.html "http://www.eloam.cn/about/about-267.html")

- **客户端控件，【人脸识别】：**[http://www.eloam.cn/down/2016-8-11/919.html](http://www.eloam.cn/down/2016-8-11/919.html "http://www.eloam.cn/down/2016-8-11/919.html")

- **高拍仪教学视频（需安装）：**[http://www.eloam.cn/down/2015-2-27/669.html](http://www.eloam.cn/down/2015-2-27/669.html "http://www.eloam.cn/down/2015-2-27/669.html")

- **良田人证比对系统 v1.0 软件下载：**[http://www.eloam.cn/down/2016-8-11/917.html](http://www.eloam.cn/down/2016-8-11/917.html "http://www.eloam.cn/down/2016-8-11/917.html")

- **良田高拍仪 V6.0 软件下载：**[http://www.eloam.cn/down/2015-3-18/714.html](http://www.eloam.cn/down/2015-3-18/714.html "http://www.eloam.cn/down/2015-3-18/714.html")

### Installation
- **硬件安装**

见文稿台背面安装图文说明，连接电脑的USB接口在文稿台背面，随机带的USB接线有接入方向，带磁环的一端接电脑，如果带磁环的一端接高拍仪底座可能会导致高拍仪搁置不稳定。

- **客户端版**


1.  安装客户端版控件（良田人证比对系统v1.0.exe）

客户端版控件含高拍仪人证比对程序

2. 安装高拍仪软件（eloamCamera6.0.exe）

高拍仪软件含OCR、摄像、拍照、识别 BARCODE / QRCODE 、二代证识读、拍照生成PDF，但不含人证比对功能

- **插件版**

浏览器控件（eloamPlugin_faceDetect_2.2.exe）

浏览器控件支持IE7以上浏览器，含有OCR、摄像、拍照、识别 BARCODE / QRCODE 、二代证识读和人证比对 **（人证比对仅在32位 IE 浏览器中通过测试）**

**32 位浏览器也存在屡屡崩溃的情况，尝试用administrator权限启动浏览器，基本不再崩溃。**

a) 初始化人脸识别 （应在视频关闭状态时调用）

 成功返回TRUE，失败返回FALSE

 ** 成功初始化需要较长时间，根据计算机性能不同在20s~40s之间 **

VARIANT_BOOL InitFaceDetect(void);

### Setup&Configuration


===================





# 浏览器环境 

## chrome44 下载 

### 便携版用于测试
[https://www.portablesoft.org/down/3978/](https://www.portablesoft.org/down/3978/)
[https://pan.baidu.com/s/1ntDxNj7](https://pan.baidu.com/s/1ntDxNj7)

### 安装版用于部署

64 bit:[https://dl.google.com/chrome/win/848F5CEF891B7DBB/44.0.2403.155_chrome64_installer.exe](https://dl.google.com/chrome/win/848F5CEF891B7DBB/44.0.2403.155_chrome64_installer.exe)
32 bit:[https://dl.google.com/chrome/win/7DE6FB2AC587843A/44.0.2403.155_chrome_installer.exe](https://dl.google.com/chrome/win/7DE6FB2AC587843A/44.0.2403.155_chrome_installer.exe)

## 开启NAAPI
[chrome://flags/](chrome://flags/) 中开启NAAPI

## 开启插件
运行测试网页后，地址栏输入 [chrome://plugins/](chrome://plugins/) 中将 eloamPlugin 设为始终运行

## 允许窗口弹出
[chrome://settings/content](chrome://settings/content)，内容设置，允许弹出窗口，设置例外