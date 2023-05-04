/** 生命周期/钩子调用时机 */

// 创建
/**
 * constructor
 * beginWork -> updateClassComponent -> constructClassInstance -> new constructor
 */

/**
 * getDerivedStateFromProps
 * beginWork -> updateClassComponent -> mountClassInstance/updateClassInstance -> applyDerivedStateFromProps -> getDerivedStateFromProps
 */

/**
 * render
 * beginWork -> updateClassComponent -> finishClassComponent -> render
 */

/**
 * componentDidMount
 * commitRoot -> commitLayoutEffects -> componentDidMount
 */

// 更新
// getDerivedStateFromProps

/**
 * shouldComponentDidUpdate
 * beginWork -> updateClassComponent -> updateClassInstance -> checkShouldComponentUpdate -> shouldComponentUpdate
 */

// render

/**
 * getSnapShotBeforeUpdate
 * commitRoot -> commitBeforeMutationEffects -> getSnapshotBeforeUpdate
 */

/**
 * componentDidUpdate
 * commitRoot -> commitLayoutEffects -> componentDidUpdate
 */

// 卸载
/**
 * componentWillUnmount
 * commitRoot -> commitMutationEffects -> componentWillUnmount
 */

/**
 * useLayoutEffect（销毁函数调用时机 commitMutationEffects）
 * commitRoot -> commitLayoutEffects
 */

/**
 * useEffect（销毁函数调用时机一样）
 * commitRoot -> commitBeforeMutationEffects -> scheduleCallback(异步调度) -> flushPassiveEffects
 */
