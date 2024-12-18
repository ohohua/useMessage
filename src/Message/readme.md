## 实现思路

其实 message.info 只是需要调用列表元素的 add、remove 等方法。

那我们通过 forwardRef 的方式把 ref 转发出去，然后保存在 context 里。

这样 useMessage 里用 useContext 拿到这个 ref，是不是就可以调用 add、remove 等方法来添加删除 Message 了呢？
<img src="../assets/image.png" />
