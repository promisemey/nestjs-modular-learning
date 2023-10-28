# nestjs-modular-learning

## 装饰器

```js
@Module： 声明 Nest 模块
@Controller：声明模块里的 controller
@Injectable：声明模块里可以注入的 provider
@Inject：通过 token 手动指定注入的 provider，token 可以是 class 或者 string
@Optional：声明注入的 provider 是可选的，可以为空
@Global：声明全局模块
@Catch：声明 exception filter 处理的 exception 类型
@UseFilters：路由级别使用 exception filter
@UsePipes：路由级别使用 pipe
@UseInterceptors：路由级别使用 interceptor
@SetMetadata：在 class 或者 handler 上添加 metadata
@Get、@Post、@Put、@Delete、@Patch、@Options、@Head：声明 get、post、put、delete、patch、options、head 的请求方式
@Param：取出 url 中的参数，比如 /aaa/:id 中的 id
@Query: 取出 query 部分的参数，比如 /aaa?name=xx 中的 name
@Body：取出请求 body，通过 dto class 来接收
@Headers：取出某个或全部请求头
@Session：取出 session 对象，需要启用 express-session 中间件
@HostParm： 取出 host 里的参数
@Req、@Request：注入 request 对象
@Res、@Response：注入 response 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 passthrough 为true
@Next：注入调用下一个 handler 的 next 方法
@HttpCode： 修改响应的状态码
@Header：修改响应头
@Redirect：指定重定向的 url
@Render：指定渲染用的模版引擎
```

## ExecutionContext：切换不同上下文

- Guard、Interceptor、Exception Filter 跨多种上下文复用呢
  
  > Nest 的解决方法是 ArgumentHost 和 ExecutionContext 类

## dockerFile

### 指令

- FROM:基于一个基础镜像来修改
- WORKDIR:指定当前工作目录
- COPY:把容器外的内容复制到容器内
- EXPOSE:声明当前容器要访问的网络端口
- RUN:在容器内执行命令
- CMD:容器启动时执行的命令

> docker build -t mest:first 构建
> runc 错误 RUN ln -s /sbin/runc /usr/bin/runc



## Reflector

+  get 

  >  `this.reflector.get(key, target)`：这个方法用于获取特定键（key）的元数据。你可以指定一个目标（target），例如一个类、方法、属性或其他项，然后通过键来检索与该目标关联的元数据。这对于在运行时检索元数据信息非常有用 
  >
  > ```js
  > const metadata = this.reflector.get('custom-key', target);
  > ```

+ set 

  >  `this.reflector.set(key, value, target)`：这个方法用于设置特定键的元数据。你可以指定一个目标（target），然后通过键来将元数据与该目标关联起来。这对于在运行时设置元数据信息非常有用。例如： 
  >
  > ```js
  > this.reflector.set('custom-key', 'custom-value', target);
  > ```

+ getAll

  >  `this.reflector.getAll(metadataKey, targets)`：这个方法用于获取多个目标的特定元数据。你可以指定一个元数据键（metadataKey）以及一个或多个目标（targets），然后检索所有指定目标的特定元数据。例如： 
  >
  > ```js
  > const metadata = this.reflector.getAll('custom-key', targets);
  > ```

+  getAllAndOverride 

  >  `this.reflector.getAllAndOverride(metadataKey, targets)`：这个方法类似于 `getAll`，但它还考虑到继承和覆盖的情况。它返回与指定元数据键关联的所有目标的元数据，并在继承和覆盖的情况下，将父类或父方法的元数据覆盖为子类或子方法的元数据。这对于检索和合并继承的元数据非常有用。例如： 
  >
  > ```js
  > const metadata = this.reflector.getAllAndOverride('custom-key', targets);
  > ```

