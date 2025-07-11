# 第8章：函数

## 引子：函数是什么？

想象一下，你正在组装一台复杂的机器。这台机器有很多零件，每个零件都有特定的功能：
- 齿轮负责传递动力
- 螺丝负责固定零件
- 电路板负责控制信号

如果每个零件都要从头开始制作，那工作量会非常大。但如果我们把常用的零件标准化，需要时直接拿来用，效率就会大大提高。

**函数就像这些标准化的零件**。它们是预先定义好的、可以重复使用的代码块，每个函数都有特定的功能。当你需要某个功能时，直接调用这个函数就可以了，不需要重新写一遍代码。

### 为什么需要函数？

这就是函数存在的意义。函数让我们能够把复杂的问题分解成小的、可管理的部分。每个函数都有明确的职责，就像公司里的不同部门一样。

让我们看一个真实的例子。假设你正在开发一个简单的银行系统，需要处理存款、取款和查询余额：

```rust
// 没有函数的情况：所有逻辑混在一起
fn main() {
    let mut account_balance = 1000.0;
    let customer_name = "张三";
    
    // 存款操作
    let deposit_amount = 500.0;
    if deposit_amount > 0.0 {
        account_balance = account_balance + deposit_amount;
        println!("{} 存款成功，金额：{}", customer_name, deposit_amount);
        println!("当前余额：{}", account_balance);
    } else {
        println!("存款金额必须大于0");
    }
    
    // 取款操作
    let withdraw_amount = 200.0;
    if withdraw_amount > 0.0 && withdraw_amount <= account_balance {
        account_balance = account_balance - withdraw_amount;
        println!("{} 取款成功，金额：{}", customer_name, withdraw_amount);
        println!("当前余额：{}", account_balance);
    } else if withdraw_amount <= 0.0 {
        println!("取款金额必须大于0");
    } else {
        println!("余额不足");
    }
    
    // 查询余额
    println!("{} 的当前余额：{}", customer_name, account_balance);
}
```

这段代码有几个问题：逻辑重复、难以维护、无法复用。如果银行有1000个客户，你就要重复写1000次类似的代码。

使用函数后，代码变得清晰和可维护：

```rust
fn deposit(balance: &mut f64, amount: f64, customer_name: &str) -> bool {
    if amount > 0.0 {
        *balance += amount;
        println!("{} 存款成功，金额：{}", customer_name, amount);
        println!("当前余额：{}", balance);
        true
    } else {
        println!("存款金额必须大于0");
        false
    }
}

fn withdraw(balance: &mut f64, amount: f64, customer_name: &str) -> bool {
    if amount > 0.0 && amount <= *balance {
        *balance -= amount;
        println!("{} 取款成功，金额：{}", customer_name, amount);
        println!("当前余额：{}", balance);
        true
    } else if amount <= 0.0 {
        println!("取款金额必须大于0");
        false
    } else {
        println!("余额不足");
        false
    }
}

fn check_balance(balance: f64, customer_name: &str) {
    println!("{} 的当前余额：{}", customer_name, balance);
}

fn main() {
    let mut account_balance = 1000.0;
    let customer_name = "张三";
    
    deposit(&mut account_balance, 500.0, customer_name);
    withdraw(&mut account_balance, 200.0, customer_name);
    check_balance(account_balance, customer_name);

    deposit(&mut account_balance, 100.0, customer_name);
    withdraw(&mut account_balance, 120.0, customer_name);
    check_balance(account_balance, customer_name);
}
```

现在，每个函数都有明确的职责：`deposit`负责存款，`withdraw`负责取款，`check_balance`负责查询余额。如果银行需要添加新客户，只需要调用这些函数即可。如果需要修改存款逻辑（比如添加手续费），只需要修改`deposit`函数，所有使用这个函数的地方都会自动更新。

这就是函数的核心价值：**把复杂的问题分解成简单的部分，让代码更容易理解、维护和复用**。

---

## 8.1 函数的基础概念

### 8.1.1 什么是函数？

**函数的定义：**
函数是一段可以重复使用的代码，它接受输入（参数），执行特定的操作，然后返回结果。

**函数的组成部分：**
```rust
fn function_name(parameter1: Type1, parameter2: Type2) -> ReturnType {
    // 函数体：具体的操作
    // 返回值
}
```

让我们用一个简单的例子来理解：

```rust
fn greet(name: &str) -> String {
    let res = format!("你好，{}！", name);
    res
}

fn main() {
    let message = greet("小明");
    println!("{}", message);  // 输出：你好，小明！
}
```

**函数各部分的作用：**
- `fn`：关键字，表示这是一个函数
- `greet`：函数名，用来调用这个函数
- `name: &str`：参数，函数接收的输入
- `-> String`：返回类型，函数输出的类型
- `let res = format!("你好，{}！", name)`：函数体，具体的操作
- `res`：返回结果

### 8.1.2 函数的声明与调用

**声明函数：**
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // 返回a + b的结果
}
```

**调用函数：**
```rust
let result = add(5, 3);  // 调用add函数，传入参数5和3
println!("5 + 3 = {}", result);  // 输出：5 + 3 = 8
```

**函数调用的过程：**
1. 程序执行到`add(5, 3)`时，暂停当前执行
2. 跳转到`add`函数的定义
3. 将参数5赋值给a，参数3赋值给b
4. 执行函数体：`a + b`（即5 + 3 = 8）
5. 返回结果8
6. 回到调用处，将8赋值给result
7. 继续执行后续代码

### 8.1.3 参数与返回值

**参数（输入）：**
参数是函数接收的数据，就像函数的"原材料"。

```rust
fn calculate_rectangle_area(width: f64, height: f64) -> f64 {
    width * height
}

fn main() {
    let area = calculate_rectangle_area(5.0, 3.0);
    println!("矩形面积：{}", area);  // 输出：矩形面积：15
}
```

**返回值（输出）：**
返回值是函数执行完后的结果，就像函数的"产品"。

```rust
fn get_max(a: i32, b: i32) -> i32 {
    if a > b {
        a  // 返回a
    } else {
        b  // 返回b
    }
}

fn main() {
    let max = get_max(10, 20);
    println!("最大值：{}", max);  // 输出：最大值：20
}
```

**多个返回值：**
Rust可以通过元组返回多个值：

```rust
fn divide_with_remainder(a: i32, b: i32) -> (i32, i32) {
    let quotient = a / b;
    let remainder = a % b;
    (quotient, remainder)  // 返回元组
}

fn main() {
    let (q, r) = divide_with_remainder(17, 5);
    println!("17 ÷ 5 = {} 余 {}", q, r);  // 输出：17 ÷ 5 = 3 余 2
}
```

### 8.1.4 与C++的对比

**C++的函数：**
```cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);
    std::cout << "5 + 3 = " << result << std::endl;
    return 0;
}
```

**Rust的函数：**
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // 不需要return关键字
}

fn main() {
    let result = add(5, 3);
    println!("5 + 3 = {}", result);
}
```

**主要区别：**
| 特点 | C++ | Rust | 说明 |
|------|-----|------|------|
| 函数声明 | `int add(int a, int b)` | `fn add(a: i32, b: i32) -> i32` | Rust语法更清晰 |
| 返回值 | 需要`return` | 最后一个表达式自动返回 | Rust更简洁 |
| 参数类型 | 在参数名后 | 在参数名后加冒号 | 语法略有不同 |
| 函数名 | 小写+下划线 | 小写+下划线 | 命名规范相同 |

## 8.2 函数的高级特性

### 8.2.1 函数类型与函数指针

**函数类型：**
在Rust中，函数也有类型，可以像其他值一样传递和使用。

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn main() {
    // 函数类型：fn(i32, i32) -> i32
    let operation: fn(i32, i32) -> i32 = add;
    let result = operation(5, 3);
    println!("结果：{}", result);  // 输出：结果：8
    
    // 可以改变指向的函数
    let operation = multiply;
    let result = operation(5, 3);
    println!("结果：{}", result);  // 输出：结果：15
}
```

**函数作为参数：**
函数可以作为参数传递给其他函数，这叫做高阶函数。

```rust
fn apply_operation(a: i32, b: i32, operation: fn(i32, i32) -> i32) -> i32 {
    operation(a, b)
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn main() {
    let result1 = apply_operation(5, 3, add);
    let result2 = apply_operation(5, 3, multiply);
    
    println!("5 + 3 = {}", result1);  // 输出：5 + 3 = 8
    println!("5 × 3 = {}", result2);  // 输出：5 × 3 = 15
}
```

**与C++的对比：**
```cpp
// C++：函数指针
int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int apply_operation(int a, int b, int (*operation)(int, int)) {
    return operation(a, b);
}

// 或者使用std::function（更现代的方式）
#include <functional>
int apply_operation_modern(int a, int b, std::function<int(int, int)> operation) {
    return operation(a, b);
}

int main() {
    int result = apply_operation(5, 3, add);
    std::cout << "结果：" << result << std::endl;
    return 0;
}
```

Rust的函数类型语法更清晰，不需要复杂的指针语法，同时比C++的std::function更简洁。

### 8.2.2 闭包：Rust的"魔法"

**什么是闭包？**
闭包是可以捕获其环境中变量的匿名函数。它就像一个"记住"周围环境的函数。

**基本闭包：**
```rust
fn main() {
    let x = 10;
    
    // 闭包：可以访问外部变量x
    let add_x = |y| x + y;
    
    let result = add_x(5);
    println!("{} + 5 = {}", x, result);  // 输出：10 + 5 = 15
}
```

**闭包的语法：**
```rust
// 基本语法：|参数| 表达式
let simple_closure = |x| x * 2;

// 多参数：|参数1, 参数2| 表达式
let add_closure = |a, b| a + b;

// 多行：|参数| { 多行代码 }
let complex_closure = |x| {
    let doubled = x * 2;
    doubled + 1
};
```

**闭包的三种类型：**
```rust
fn main() {
    let mut counter = 0;
    
    // Fn：不可变借用
    let read_counter = || {
        println!("计数器：{}", counter);
    };
    
    // FnMut：可变借用
    let mut increment = || {
        counter += 1;
        println!("计数器增加到：{}", counter);
    };
    
    // FnOnce：获取所有权
    let consume_counter = move || {
        println!("消耗计数器：{}", counter);
        // counter在这里被移动，不能再使用
    };
    
    read_counter();    // 可以多次调用
    increment();       // 可以多次调用
    consume_counter(); // 只能调用一次
}
```

**闭包的实际应用：**
```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 使用闭包过滤偶数
    let even_numbers: Vec<i32> = numbers.iter()
        .filter(|&x| x % 2 == 0)
        .cloned()
        .collect();
    
    println!("偶数：{:?}", even_numbers);  // 输出：偶数：[2, 4]
    
    // 使用闭包映射（每个数乘以2）
    let doubled: Vec<i32> = numbers.iter()
        .map(|x| x * 2)
        .collect();
    
    println!("翻倍：{:?}", doubled);  // 输出：翻倍：[2, 4, 6, 8, 10]
}
```

**与C++的对比：**
C++11引入了lambda表达式，但功能相对有限：

```cpp
// C++：lambda表达式
#include <iostream>
#include <functional>

int main() {
    int counter = 0;
    
    // C++ lambda表达式
    auto increment = [&counter]() {
        counter++;
        std::cout << "计数器：" << counter << std::endl;
    };
    
    increment();
    increment();
    
    // 但是C++的lambda不能像Rust闭包那样灵活地返回
    return 0;
}
```

Rust的闭包提供了更安全、更灵活的方式来捕获环境变量，语法也更简洁。

### 8.2.3 函数式编程初体验

**什么是函数式编程？**
函数式编程是一种编程范式，强调使用函数来解决问题，避免状态变化和副作用。

**Rust的函数式特性：**

**1. 高阶函数：**
```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 链式调用：函数式编程的典型特征
    let result: i32 = numbers.iter()
        .filter(|&x| x % 2 == 0)  // 过滤偶数
        .map(|x| x * x)           // 平方
        .sum();                   // 求和
    
    println!("偶数的平方和：{}", result);  // 输出：偶数的平方和：20
}
```

**2. 不可变性：**
```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 不修改原数据，创建新的结果
    let doubled: Vec<i32> = numbers.iter()
        .map(|x| x * 2)
        .collect();
    
    println!("原数组：{:?}", numbers);    // 原数组：[1, 2, 3, 4, 5]
    println!("翻倍后：{:?}", doubled);    // 翻倍后：[2, 4, 6, 8, 10]
}
```

**3. 纯函数：**
```rust
// 纯函数：相同的输入总是产生相同的输出，没有副作用
fn pure_add(a: i32, b: i32) -> i32 {
    a + b  // 只依赖输入参数，不修改外部状态
}

// 非纯函数：有副作用
fn impure_add(a: i32, b: i32) -> i32 {
    println!("正在计算 {} + {}", a, b);  // 副作用：打印输出
    a + b
}
```

**函数式编程的优势：**
1. **代码更清晰**：每个函数都有明确的输入和输出
2. **更容易测试**：纯函数更容易进行单元测试
3. **更容易并行**：没有共享状态，更容易并行执行
4. **更少的bug**：避免状态变化带来的复杂性

## 8.3 作用域与生命周期初步

### 8.3.1 什么是作用域？

**作用域的定义：**
作用域是变量在程序中有效的区域，就像变量的"生存空间"。

**基本作用域规则：**
```rust
fn main() {
    let x = 10;  // x的作用域开始
    
    {
        let y = 20;  // y的作用域开始
        println!("x = {}, y = {}", x, y);  // 可以访问x和y
    }  // y的作用域结束，y被释放
    
    println!("x = {}", x);  // 可以访问x
    // println!("y = {}", y);  // 错误！y已经不存在了
}  // x的作用域结束，x被释放
```

**作用域就像房间：**
- 每个变量都有自己的"房间"（作用域）
- 内层房间可以看到外层房间的东西
- 外层房间看不到内层房间的东西
- 当房间"关门"时，里面的东西就被清理了

### 8.3.2 函数作用域

**函数参数的作用域：**
```rust
fn calculate_area(radius: f64) -> f64 {
    // radius的作用域：从函数开始到函数结束
    let pi = 3.14159;  // pi的作用域：从声明到函数结束
    pi * radius * radius
}  // radius和pi的作用域结束

fn main() {
    let area = calculate_area(5.0);
    // println!("{}", radius);  // 错误！radius不在这个作用域
}
```

**局部变量的作用域：**
```rust
fn main() {
    let x = 10;
    
    if x > 5 {
        let y = 20;  // y只在if块内有效
        println!("y = {}", y);
    }
    // println!("y = {}", y);  // 错误！y已经不存在了
}
```

### 8.3.3 生命周期初步

**什么是生命周期？**
生命周期是引用保持有效的时间段。在Rust中，每个引用都有一个生命周期。

**简单的生命周期：**
```rust
fn main() {
    let x = 10;
    let r = &x;  // r引用x，生命周期与x相同
    
    println!("x = {}, r = {}", x, r);
}  // x和r同时结束
```

**生命周期错误：**
```rust
fn main() {
    let r;
    {
        let x = 10;
        r = &x;  // 错误！x的生命周期比r短
    }
    println!("r = {}", r);  // 错误！x已经不存在了
}
```

**函数中的生命周期：**
```rust
// 这个函数有生命周期问题
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// 正确的写法（后续章节会详细讲解）
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

**与C++的对比：**
```cpp
// C++：没有生命周期检查
int* create_pointer() {
    int x = 10;
    return &x;  // 危险！返回局部变量的地址
}

int main() {
    int* ptr = create_pointer();
    std::cout << *ptr << std::endl;  // 未定义行为！
    return 0;
}

// C++11引入了智能指针，但生命周期管理仍然复杂
#include <memory>
std::unique_ptr<int> create_smart_pointer() {
    return std::make_unique<int>(10);
}
```

Rust的生命周期系统在编译时就能发现这类问题，防止悬垂引用，比C++的智能指针更安全。

## 8.4 实战练习

现在让我们通过实际的练习来巩固学到的知识。

### 练习1：基础函数

**目标：** 学习如何定义和调用基本函数

**步骤：**
1. 创建新项目：`cargo new function_practice1`
2. 编写代码：

```rust
// 定义一个计算两个数最大值的函数
fn max(a: i32, b: i32) -> i32 {
    if a > b {
        a
    } else {
        b
    }
}

// 定义一个计算阶乘的函数
fn factorial(n: u32) -> u32 {
    if n == 0 || n == 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

fn main() {
    // 测试max函数
    println!("max(5, 3) = {}", max(5, 3));
    println!("max(10, 20) = {}", max(10, 20));
    
    // 测试factorial函数
    println!("5! = {}", factorial(5));
    println!("0! = {}", factorial(0));
}
```

**运行结果：**
```
max(5, 3) = 5
max(10, 20) = 20
5! = 120
0! = 1
```

### 练习2：函数作为参数

**目标：** 学习如何使用高阶函数

**步骤：**
1. 创建新项目：`cargo new function_practice2`
2. 编写代码：

```rust
// 定义一个高阶函数，接受一个函数作为参数
fn apply_operation<F>(a: i32, b: i32, operation: F) -> i32
where
    F: Fn(i32, i32) -> i32,
{
    operation(a, b)
}

// 定义几个具体的操作函数
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn power(a: i32, b: i32) -> i32 {
    a.pow(b as u32)
}

fn main() {
    let x = 5;
    let y = 3;
    
    // 使用不同的操作函数
    println!("{} + {} = {}", x, y, apply_operation(x, y, add));
    println!("{} × {} = {}", x, y, apply_operation(x, y, multiply));
    println!("{} ^ {} = {}", x, y, apply_operation(x, y, power));
    
    // 使用闭包
    let subtract = |a, b| a - b;
    println!("{} - {} = {}", x, y, apply_operation(x, y, subtract));
}
```

### 练习3：闭包应用

**目标：** 学习闭包的实际应用

**步骤：**
1. 创建新项目：`cargo new function_practice3`
2. 编写代码：

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // 使用闭包过滤和转换数据
    let even_squares: Vec<i32> = numbers.iter()
        .filter(|&x| x % 2 == 0)  // 过滤偶数
        .map(|x| x * x)           // 平方
        .collect();
    
    println!("偶数的平方：{:?}", even_squares);
    
    // 使用闭包计算统计信息
    let sum: i32 = numbers.iter().sum();
    let count = numbers.len();
    let average = sum as f64 / count as f64;
    
    println!("数组：{:?}", numbers);
    println!("总和：{}", sum);
    println!("数量：{}", count);
    println!("平均值：{:.2}", average);
    
    // 使用闭包查找最大值和最小值
    let max = numbers.iter().max().unwrap();
    let min = numbers.iter().min().unwrap();
    println!("最大值：{}，最小值：{}", max, min);
}
```

### 练习4：作用域理解

**目标：** 理解作用域和生命周期

**步骤：**
1. 创建新项目：`cargo new function_practice4`
2. 编写代码：

```rust
fn create_counter() -> impl FnMut() -> i32 {
    let mut count = 0;
    move || {
        count += 1;
        count
    }
}

fn main() {
    // 创建一个计数器
    let mut counter1 = create_counter();
    let mut counter2 = create_counter();
    
    // 使用计数器
    println!("Counter1: {}", counter1());  // 1
    println!("Counter1: {}", counter1());  // 2
    println!("Counter2: {}", counter2());  // 1
    println!("Counter1: {}", counter1());  // 3
    println!("Counter2: {}", counter2());  // 2
    
    // 演示作用域
    {
        let x = 10;
        println!("在内部作用域中，x = {}", x);
        
        {
            let y = 20;
            println!("在更内部的作用域中，x = {}, y = {}", x, y);
        }  // y的作用域结束
        
        println!("回到内部作用域，x = {}", x);
        // println!("y = {}", y);  // 错误！y已经不存在了
    }  // x的作用域结束
    
    // println!("x = {}", x);  // 错误！x已经不存在了
}
```

### 练习5：综合应用

**目标：** 综合运用本章学到的所有知识

**步骤：**
1. 创建新项目：`cargo new function_practice5`
2. 编写一个简单的计算器程序：

```rust
// 定义操作类型
enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
}

// 定义计算器结构
struct Calculator {
    operations: Vec<(Operation, fn(f64, f64) -> f64)>,
}

impl Calculator {
    fn new() -> Self {
        let mut calc = Calculator { operations: Vec::new() };
        
        // 添加基本操作
        calc.add_operation(Operation::Add, |a, b| a + b);
        calc.add_operation(Operation::Subtract, |a, b| a - b);
        calc.add_operation(Operation::Multiply, |a, b| a * b);
        calc.add_operation(Operation::Divide, |a, b| {
            if b == 0.0 {
                panic!("除数不能为零！");
            }
            a / b
        });
        
        calc
    }
    
    fn add_operation(&mut self, op: Operation, func: fn(f64, f64) -> f64) {
        self.operations.push((op, func));
    }
    
    fn calculate(&self, op: &Operation, a: f64, b: f64) -> f64 {
        for (operation, func) in &self.operations {
            if std::mem::discriminant(operation) == std::mem::discriminant(op) {
                return func(a, b);
            }
        }
        panic!("未知操作！");
    }
}

fn main() {
    let calculator = Calculator::new();
    
    let a = 10.0;
    let b = 3.0;
    
    println!("计算器演示：");
    println!("{} + {} = {:.2}", a, b, calculator.calculate(&Operation::Add, a, b));
    println!("{} - {} = {:.2}", a, b, calculator.calculate(&Operation::Subtract, a, b));
    println!("{} × {} = {:.2}", a, b, calculator.calculate(&Operation::Multiply, a, b));
    println!("{} ÷ {} = {:.2}", a, b, calculator.calculate(&Operation::Divide, a, b));
    
    // 演示错误处理
    println!("10 ÷ 0 = ");
    match std::panic::catch_unwind(|| {
        calculator.calculate(&Operation::Divide, 10.0, 0.0)
    }) {
        Ok(result) => println!("{:.2}", result),
        Err(_) => println!("错误：除数不能为零！"),
    }
}
```

## 8.5 小结与思考

恭喜你！你已经掌握了Rust函数的基础知识。让我们来回顾一下这一章学到了什么：

### 本章要点总结

**1. 函数就像标准化的零件**
- 可以重复使用，避免重复代码
- 有明确的输入（参数）和输出（返回值）
- 让代码结构更清晰，便于维护

**2. 函数的高级特性**
- 函数类型：函数可以作为值传递
- 高阶函数：函数可以作为参数
- 闭包：可以捕获环境的匿名函数
- 函数式编程：强调不可变性和纯函数

**3. 作用域与生命周期**
- 作用域：变量的有效区域
- 生命周期：引用的有效时间段
- Rust在编译时检查，防止悬垂引用

**4. 与C语言的主要区别**
| 特点 | C语言 | Rust | 优势 |
|------|-------|------|------|
| 函数指针 | 复杂语法 | 清晰类型 | 更易理解 |
| 闭包 | 不支持 | 原生支持 | 更灵活 |
| 生命周期 | 运行时检查 | 编译时检查 | 更安全 |
| 函数式编程 | 有限支持 | 原生支持 | 更现代 |

### 思考题

**初级思考：**
1. 为什么需要函数？你能举出生活中哪些事情可以看作"函数"？
2. 闭包和普通函数有什么区别？什么时候使用闭包？

**中级思考：**
3. 函数式编程和命令式编程有什么不同？各有什么优缺点？
4. Rust的生命周期系统如何防止内存错误？

**高级思考：**
5. 如果让你设计一个函数库，你会如何组织函数的结构？
6. 闭包捕获环境变量的三种方式（Fn、FnMut、FnOnce）有什么区别？什么时候使用哪种？

### 下一步学习

在下一章中，我们将学习：
- 模块系统：如何组织代码结构
- 包管理：如何管理项目依赖
- 可见性控制：如何控制代码的访问权限
- 文档注释：如何编写高质量的文档

函数是编程的基础，掌握好函数的使用，将为后续学习更高级的Rust特性打下坚实的基础。记住，编程最重要的是实践，多写代码，多思考，你就能越来越熟练地使用Rust的函数特性！

## 附录：C++与Rust的函数调用栈深度解析

### 栈帧的详细结构

函数调用栈不是简单的“盘子叠加”，而是一个精心设计的内存布局。每个栈帧（stack frame）通常包含：
- 参数区：存放传入的参数
- 返回地址：函数返回后跳转的地址
- 保存的基址指针（frame pointer）：用于恢复上一个栈帧
- 局部变量区：当前函数的局部变量
- 临时/对齐空间：表达式计算的中间结果或对齐填充

**典型栈帧结构（高地址→低地址）：**
```
高地址
+------------------+
| 参数区           |
+------------------+
| 返回地址         |
+------------------+
| 上一帧基址指针   |
+------------------+
| 局部变量         |
+------------------+
| 临时/对齐空间    |
+------------------+
低地址
```

### C++的栈帧处理机制

**函数调用过程：**
```cpp
int add(int a, int b) {
    int result = a + b;
    return result;
}

int main() {
    int x = 10, y = 20;
    int sum = add(x, y);
    return 0;
}
```

1. **参数压栈**：参数从右到左依次压入栈（或部分用寄存器传递，取决于ABI）
2. **返回地址压栈**：压入main中add调用后的下一条指令地址
3. **保存基址指针**：保存main的栈帧基址
4. **设置新基址指针**：esp赋值给ebp（x86）
5. **分配局部变量空间**：esp向下移动

**汇编示例（x86）：**
```assembly
push 20          ; 压入第二个参数
tpush 10          ; 压入第一个参数
call add         ; 跳转到add，返回地址自动压栈
add:
    push ebp     ; 保存基址指针
    mov ebp, esp ; 设置新基址
    sub esp, 4   ; 分配局部变量result
    mov eax, [ebp+8]  ; 取第一个参数a
    add eax, [ebp+12] ; 加第二个参数b
    mov [ebp-4], eax  ; 存result
    mov eax, [ebp-4]  ; 返回值放eax
    mov esp, ebp      ; 恢复esp
    pop ebp           ; 恢复基址
    ret               ; 弹出返回地址并跳转
```

**返回时**：恢复基址指针，弹出返回地址，栈指针回到调用前。

### Rust的栈帧处理机制

Rust的栈帧结构与C++基本一致，但有如下特点：
- 小型参数（如i32）优先用寄存器传递，结构体等大对象用栈
- 编译器更激进地内联优化，可能消除栈帧
- 生命周期信息仅在编译期参与分析，不会实际存储在栈上
- 所有权转移、借用等语义在栈帧层面由编译器静态保证

**示例：**
```rust
fn add(a: i32, b: i32) -> i32 {
    let result = a + b;
    result
}

fn main() {
    let x = 10;
    let y = 20;
    let sum = add(x, y);
}
```

**Rust的优化：**
- 参数a、b通常直接用寄存器传递
- 局部变量result分配在栈帧
- 编译器可能直接内联add，消除栈帧

**所有权影响：**
```rust
fn take(s: String) {
    println!("{}", s);
} // s在这里被释放

fn main() {
    let text = String::from("hi");
    take(text); // text所有权转移，main中text失效
}
```

### 内存布局对比

**C++栈帧布局：**
```
高地址
+------------------+
| 参数b (20)       |
+------------------+
| 参数a (10)       |
+------------------+
| 返回地址         |
+------------------+
| 上一帧基址指针   |
+------------------+
| 局部变量result   |
+------------------+
低地址
```

**Rust栈帧布局（优化后）：**
```
高地址
+------------------+
| 参数（寄存器）   |
+------------------+
| 返回地址         |
+------------------+
| 上一帧基址指针   |
+------------------+
| 局部变量         |
+------------------+
低地址
```

### 安全性与典型问题

**C++悬垂指针：**
```cpp
int* danger() {
    int local = 42;
    return &local; // 返回局部变量地址，危险！
}
```
调用后local已被释放，指针悬垂。

**Rust编译期防护：**
```rust
fn danger() -> &i32 {
    let local = 42;
    &local // 编译错误：local不活跃
}
```
Rust编译器直接拒绝编译。

### 性能与安全对比

| 方面         | C++         | Rust        | 说明           |
|--------------|-------------|-------------|----------------|
| 栈帧分配     | 编译时确定  | 编译时确定  | 基本相同       |
| 参数传递     | 栈/寄存器   | 寄存器优先  | Rust更高效     |
| 内联优化     | 支持        | 更激进      | Rust优化更好   |
| 安全检查     | 运行时/无   | 编译时      | Rust零开销安全 |
| 内存布局     | 标准        | 优化        | Rust更紧凑     |

### 小结

C++和Rust的栈帧机制底层原理类似，但Rust通过编译期优化和生命周期检查，在保持零开销的同时提供了更强的安全性保证。理解栈帧结构有助于写出高效且安全的代码，也让我们更好地理解Rust安全性的底层原理。
