// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/308

/**
 * webpack 中 loader 和 plugin 的区别是什么
 * 1. loader 用于转换指定类型的模块
 * 2. plugins 用于执行更广泛的任务（打包优化、文件管理、环境注入等）
 *
 * a. loader 完成代码转换（打包器）
 *    - webpack只支持js和json
 *    - commonjs规范
 * b. plugin 在打包前后进行再次操作（扩展器-功能扩展）
 *    - 基于事件机制工作（事件广播）（监听打包过程的事件节点，执行任务）
 *    - 不直接操作文件
 */
