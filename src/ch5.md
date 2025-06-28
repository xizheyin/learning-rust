# 第5章：Rust语言特点总览

在前面的章节中，我们已经了解了Rust的背景和计算机基础知识。现在让我们深入探讨Rust的核心语言特点，通过与C语言的对比来理解Rust的设计理念和优势。

## 5.0 核心概念解释

在开始对比之前，我们先来理解一些重要的编程概念。这些概念可能听起来很抽象，但实际上它们每天都在影响我们的编程工作。

### 5.0.1 什么是类型系统？

我们通过代码操纵某种某些值，这个值需要有类型。类型告诉计算机这个数据是什么，也决定了能对这个数据做什么操作。
举一个生活中的例子，我们不能对两个类型为老虎进行相加减，但是我们可以对两个老虎的身高进行加减。而前者的类型是"老虎"，而后者的类型是"整数"

一些常见的类型：数字42的类型是整数，字符串"hello"的类型是文本，小数3.14的类型是浮点数。

**为什么需要类型系统？**
类型系统帮助我们避免错误。比如我们不能把一个人的年龄和名字相加，同样在编程中，我们也应该避免把整数和字符串相加。类型系统会在编译时检查这些错误，防止程序运行时出现问题。

**静态类型 vs 动态类型：**
静态类型语言（如C、Rust）在**编译时**就确定所有数据的类型，如果类型不匹配就会报错。动态类型语言（如Python、JavaScript）在运行时才确定类型，更灵活但可能出现**运行时错误**。

### 5.0.2 什么是内存管理？

内存管理就像是管理一个巨大的仓库。
我们前面提到过，程序在运行的时候，数据是存储在硬件（内存）中的。
计算机的内存就像是一个大仓库，里面有很多小格子，每个格子可以存储一个数据。当我们写程序时，需要在这个仓库中分配空间来存储我们的数据。

**内存分配的过程：**
当我们声明一个变量时，比如 `int a = 10;`，程序会向操作系统（回顾，操作系统的作用）申请一个内存格子来存储这个数字10。这个格子有固定的地址，程序通过这个地址来访问和修改数据。

**内存管理的问题：**
内存是有限的资源，如果我们申请了内存但不释放，就会造成*内存泄漏*。就像在仓库中占用了格子但不用，其他程序就没法使用这些空间了。相反，如果我们释放了内存但还在使用，就会访问到无效的数据，导致程序崩溃，这叫*悬挂/垂指针（dangling pointer）*。

**手动管理 vs 自动管理：**
C语言采用手动内存管理，程序员需要自己申请和释放内存。这给了程序员最大的控制权，但也容易出错。Rust采用自动内存管理，通过所有权机制在编译时确保内存的正确使用，既保证了性能又避免了常见的内存错误。

### 5.0.3 什么是所有权？

想象一下，你是一个图书管理员（操作系统），可以给每一个人发书，但是每个人在使用完之后需要归还，因为图书馆的书是有限的（内存资源有限）。
这个图书馆有一个铁律：**每本书只能有一个*所有者*，而且*所有者*必须负责归还这本书**。


**所有权的核心思想：**
在Rust的世界里，每个数据就像图书馆里的一本书。每本书被拿走后都有一个"所有者"，这个所有者有这本书的完全控制权。
"所有者"可以阅读这本书，可以把它借给别人，也可以把它扔掉。但是，当主人离开图书馆（*作用域*）时，如果这本书还在他手里，图书馆会自动把这本书收回来。

让我们跟着小明和小红的故事来理解所有权：

```
小明走进图书馆，借了一本《Rust编程指南》。
现在小明是这本书的所有者，他可以：
- 阅读这本书
- 把书借给小红
- 把书的所有者身份交给小红（转移所有权）
- 把书还给图书馆（释放内存）

如果小明只是借给小红看一下，那么小明始终需要对这本书负责：
- 小明依然是这本书的所有者
- 小红看完需要还给小明
- 当小明离开图书馆时，图书馆会自动把书收回来。

如果小明把所有者身份给了小红，那么小明不必再对这本书负责了：
- 小明不再是这本书的主人
- 小红成为新的主人
- 小明不能再使用这本书
- 当小红离开图书馆时，如果书还在她手里，图书馆会自动把书收回来。

```

**所有权的三条铁律：**

1. **每本书只能有一个主人** - 每个值只能有一个所有者
2. **主人可以转移所有权** - 所有者可以把值转移给其他人
3. **主人离开时书必须归还** - 当所有者离开作用域时，值对应的内存会被自动释放

**为什么需要所有权？**

在传统的编程语言中，就像图书馆允许一本书同时被多个人借阅一样，多个变量可以指向同一块内存。这听起来很方便，但实际上会造成混乱：

- **谁负责归还？** 如果小明和小红都借了同一本书，谁应该归还？小明说我不是借给你了么，你还。小红说，那最开始不是你借的吗，你还！
- **什么时候归还？** 如果没人记得归还，书就会永远留在外面（内存泄漏）
- **重复归还怎么办？** 如果小明说他要还，小红说她也要还，图书馆会混乱（重复释放）

Rust的所有权机制就像是一个严格的图书馆管理员，确保每本书只有一个借阅者，避免了所有这些混乱。**所有权机制明确规定了到底是谁来对这块内存负责！！！！！！**

**生活中的其他例子：**

- **汽车钥匙**：你有一把车钥匙，你可以开车，可以把钥匙给别人，但同一时间只能有一个人有钥匙
- **银行账户**：你的银行账户只能有一个主人，你可以转账给别人，但转账后你就失去了对这笔钱的控制
- **房子**：你拥有一套房子，你可以住，可以卖，可以租，但同一时间只能有一个房主

---

**技术概念精讲：**

所有权是Rust内存管理的核心机制，它通过编译时的静态分析来确保内存安全，无需运行时垃圾回收。

**所有权的技术定义：**
- **所有者（Owner）**：拥有数据值的变量，负责管理该值的生命周期
- **作用域（Scope）**：变量有效的代码区域，从声明开始到作用域结束
- **移动（Move）**：所有权从一个变量转移到另一个变量，原变量变为无效
- **释放（Drop）**：当所有者离开作用域时，自动调用析构函数释放资源

**所有权的技术规则：**
1. **唯一性**：每个值在任何时刻只能有一个所有者
2. **转移语义**：赋值、函数参数传递、函数返回值都会转移所有权
3. **自动释放**：当所有者离开作用域时，值会被自动释放

**编译时检查：**
Rust编译器在编译时分析每个变量的生命周期，确保：
- 没有悬垂引用（dangling references）
- 没有数据竞争（data races）
- 没有内存泄漏（memory leaks）
- 没有重复释放（double free）

**所有权与内存安全：**
通过所有权机制，Rust在编译时就能发现潜在的内存安全问题，避免了C/C++中常见的运行时错误。这种设计既保证了内存安全，又保持了零成本抽象的性能优势。

### 5.0.4 什么是错误处理？

错误处理就像是处理生活中的意外情况。当我们写程序时，很多事情可能出错：文件不存在、网络连接失败、用户输入无效等。程序需要优雅地处理这些错误，而不是**直接崩溃**：Segmentation fault (core dumped)。

**错误处理的挑战：**
在C语言中，错误处理通常通过返回特殊值（如-1、NULL）来表示。这种方法简单，但容易忘记检查错误，也容易混淆正常值和错误值。

**Rust的错误处理：**
Rust通过Result类型来处理错误。Result就像一个盒子，里面要么是成功的结果，要么是错误信息。程序**必须明确处理这两种情况**，不能忽略错误。这确保了程序的健壮性。

### 5.0.5 什么是并发安全？

并发安全就像是多人同时使用同一个资源时的协调问题。想象一下，如果多个人同时往同一个银行账户存钱，我们需要确保每个人的操作都是安全的，不会相互干扰。

**并发的问题：**
当多个线程同时访问同一个数据时，可能出现数据竞争。比如两个线程同时读取一个计数器，然后各自加1，最后写回。如果操作不当，可能只加了一次而不是两次。

**Rust的并发安全：**
Rust通过类型系统在编译时检查并发安全问题。如果一个数据可能被多个线程同时访问，Rust会要求使用特殊的类型（如Mutex、Arc）来确保安全访问。这避免了运行时才发现并发错误。

现在我们对这些核心概念有了基本理解，接下来看看C语言和Rust在这些方面有什么不同。

## 5.1 类型系统对比

### 5.1.1 静态类型与类型推断

C语言和Rust都是静态类型语言，但Rust的类型推断让代码更简洁。

**C语言：**
```c
int a = 10;           // 必须显式声明类型
int b = 20;
int result = a + b;   // 类型必须明确
```

**Rust：**
```rust
let a = 10;           // 类型推断为 i32
let b = 20;           // 类型推断为 i32
let result = a + b;   // 自动推断为 i32
```

**显式类型声明（Rust）：**
```rust
let a: i32 = 10;      // 显式指定类型
let b: f64 = 3.14;    // 浮点数类型
```

Rust的类型推断让代码更简洁，同时保持了静态类型的安全性。编译器能够根据上下文自动推断出变量的类型，减少了代码的冗余，但当我们需要明确指定类型时，仍然可以显式声明。

### 5.1.2 类型安全

**C语言的类型安全问题：**
```c
int main() {
    int a = 10;
    float b = 3.14;
    int result = a + b;  // 隐式类型转换，可能丢失精度
    return 0;
}
```

**Rust的类型安全：**
```rust
fn main() {
    let a: i32 = 10;
    let b: f64 = 3.14;
    // let result = a + b;  // 编译错误：不能直接相加不同类型
    
    // 正确的做法
    let result = a as f64 + b;  // 显式类型转换
    println!("结果: {}", result);
}
```

Rust禁止隐式类型转换，要求开发者明确表达意图。这看起来可能有些麻烦，但实际上避免了意外的精度丢失和类型错误。当我们确实需要类型转换时，必须使用 `as` 关键字显式转换，这样代码的意图就非常清楚了。

## 5.2 内存管理对比

### 5.2.1 手动管理 vs 自动管理

**C语言的手动内存管理：**
```c
#include <stdlib.h>

int main() {
    // 手动分配内存
    int* ptr = (int*)malloc(sizeof(int));
    if (ptr == NULL) {
        return 1;  // 检查分配失败
    }
    
    *ptr = 42;
    printf("值: %d\n", *ptr);
    
    // 手动释放内存
    free(ptr);
    ptr = NULL;  // 避免悬垂指针
    
    return 0;
}
```

**Rust的自动内存管理：**
```rust
fn main() {
    // 自动分配和释放内存
    let value = Box::new(42);
    println!("值: {}", value);
    
    // 离开作用域时自动释放
} // 这里 value 自动释放
```

C语言需要手动管理内存的分配和释放。当我们使用 `malloc` 分配内存时，必须记住用 `free` 释放，否则会造成内存泄漏。Rust通过所有权机制自动管理内存，当变量离开作用域时，内存会自动释放，不需要手动管理。

### 5.2.2 所有权机制

**C语言的指针问题：**
```c
#include <stdlib.h>

int* create_value() {
    int* ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    return ptr;  // 返回指针，调用者负责释放
}

void use_value(int* ptr) {
    printf("值: %d\n", *ptr);
    // 这里不能释放，因为不知道是否还有其他地方在使用
}

int main() {
    int* ptr = create_value();
    use_value(ptr);
    free(ptr);  // 容易忘记释放
    return 0;
}
```

**Rust的所有权机制：**
```rust
fn create_value() -> Box<i32> {
    Box::new(42)  // 返回所有权
}

fn use_value(value: Box<i32>) {
    println!("值: {}", value);
} // value 在这里被释放

fn main() {
    let value = create_value();
    use_value(value);  // 所有权转移给 use_value
    // println!("{}", value);  // 编译错误：value 已经被移动
}
```

在C语言中，当我们返回一个指针时，调用者需要负责释放内存。这容易造成内存泄漏或重复释放的问题。Rust的所有权机制确保每个值只有一个所有者，当所有权转移时，原来的变量就不能再使用了。这避免了内存管理的问题。

### 5.2.3 借用机制

**C语言的引用传递：**
```c
void modify_value(int* ptr) {
    *ptr = 100;  // 直接修改原值
}

int main() {
    int value = 42;
    modify_value(&value);
    printf("修改后: %d\n", value);  // 输出: 100
    return 0;
}
```

**Rust的借用机制：**
```rust
fn modify_value(value: &mut i32) {
    *value = 100;  // 通过可变引用修改
}

fn main() {
    let mut value = 42;
    modify_value(&mut value);
    println!("修改后: {}", value);  // 输出: 100
}
```

**不可变借用：**
```rust
fn print_value(value: &i32) {
    println!("值: {}", value);
}

fn main() {
    let value = 42;
    print_value(&value);  // 不可变借用
    println!("原值: {}", value);  // 仍然可以使用
}
```

Rust的借用机制比C语言的指针更安全。当我们使用引用时，编译器会检查引用的生命周期，确保引用不会指向已经释放的内存。同时，Rust区分了可变引用和不可变引用，防止了数据竞争。

## 5.3 错误处理对比

### 5.3.1 C语言的错误处理

**C语言的传统错误处理：**
```c
#include <stdio.h>
#include <stdlib.h>

int divide(int a, int b) {
    if (b == 0) {
        return -1;  // 错误码
    }
    return a / b;
}

int main() {
    int result = divide(10, 0);
    if (result == -1) {
        printf("错误：除数不能为零\n");
        return 1;
    }
    printf("结果: %d\n", result);
    return 0;
}
```

### 5.3.2 Rust的Result类型

**Rust的Result错误处理：**
```rust
fn divide(a: i32, b: i32) -> Result<i32, &'static str> {
    if b == 0 {
        Err("除数不能为零")
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10, 0) {
        Ok(result) => println!("结果: {}", result),
        Err(error) => println!("错误: {}", error),
    }
}
```

**使用?运算符简化错误处理：**
```rust
fn divide(a: i32, b: i32) -> Result<i32, &'static str> {
    if b == 0 {
        return Err("除数不能为零");
    }
    Ok(a / b)
}

fn process_division() -> Result<(), &'static str> {
    let result = divide(10, 2)?;  // 如果出错，直接返回错误
    println!("结果: {}", result);
    Ok(())
}
```

C语言使用特殊的返回值（如-1）来表示错误，这种方法简单但容易忘记检查。Rust的Result类型明确区分了成功和失败的情况，程序必须处理这两种情况，不能忽略错误。

### 5.3.3 Option类型

**C语言处理空值：**
```c
#include <stdio.h>
#include <stdlib.h>

int* find_value(int* arr, int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return &arr[i];  // 返回指针，可能为NULL
        }
    }
    return NULL;  // 表示未找到
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int* result = find_value(arr, 5, 3);
    
    if (result != NULL) {
        printf("找到值: %d\n", *result);
    } else {
        printf("未找到值\n");
    }
    return 0;
}
```

**Rust的Option类型：**
```rust
fn find_value(arr: &[i32], target: i32) -> Option<&i32> {
    for item in arr {
        if *item == target {
            return Some(item);
        }
    }
    None
}

fn main() {
    let arr = [1, 2, 3, 4, 5];
    match find_value(&arr, 3) {
        Some(value) => println!("找到值: {}", value),
        None => println!("未找到值"),
    }
}
```

Option类型就像是一个安全的盒子，如果我们遇到有可能为空的时候，必须要用这个盒子装起来。如果我们想要拿到盒子里面的值，就必须要告诉编译器如何处理空值的情况。

上面的例子中，通过match匹配，如果是空值那么就输出未找到值。所以我们可以看到，Rust中，可能的空值都会被我们手动处理。即使在取出这个值的时候程序终止，也一定是我们要求的，不会出现C语言莫名其妙的崩溃！

## 5.4 并发安全对比

### 5.4.1 C语言的多线程问题

**C语言的数据竞争：**
```c
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

int counter = 0;  // 全局变量

void* increment(void* arg) {
    for (int i = 0; i < 10000; i++) {
        counter++;  // 数据竞争！
    }
    return NULL;
}

int main() {
    pthread_t thread1, thread2;
    
    pthread_create(&thread1, NULL, increment, NULL);
    pthread_create(&thread2, NULL, increment, NULL);
    
    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    
    printf("最终计数: %d\n", counter);  // 结果不确定
    return 0;
}
```

### 4.4.2 Rust的并发安全

**Rust的线程安全：**
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..2 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            for _ in 0..10000 {
                let mut num = counter.lock().unwrap();
                *num += 1;
            }
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("最终计数: {}", *counter.lock().unwrap());
}
```

**Rust的Send和Sync trait：**
```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3, 4, 5];
    
    // 移动所有权到新线程
    let handle = thread::spawn(move || {
        println!("在新线程中处理数据: {:?}", data);
    });
    
    handle.join().unwrap();
}
```

C语言中，多个线程可以同时访问同一个变量，这可能导致数据竞争。程序员需要手动使用锁来保护共享数据。Rust通过类型系统在编译时检查并发安全问题，如果一个数据可能被多个线程访问，必须使用特殊的类型来确保安全。

## 5.5 零成本抽象

### 5.5.1 什么是零成本抽象？

零成本抽象是Rust的核心设计理念之一，它的含义是：**高级抽象不应该带来运行时性能损失**。换句话说，你写的抽象代码在编译后应该和手写的低级代码性能相同。

**抽象的概念：**
抽象就像是把复杂的事情简化。比如，当我们说"开车"时，我们不需要知道发动机如何工作、变速箱如何换挡，我们只需要踩油门、踩刹车、转方向盘。这就是抽象——隐藏复杂的细节，提供简单的接口。

**零成本的含义：**
零成本意味着使用抽象不会让你付出性能代价。就像开车一样，你不需要因为使用了"开车"这个抽象概念而开得更慢。在编程中，使用迭代器、泛型、trait等高级抽象，不应该比手写循环、具体类型、函数指针更慢。

### 5.5.2 为什么零成本抽象如此重要？

**性能与安全性的平衡：**
在传统编程中，我们经常面临一个选择：要么写高性能但危险的代码，要么写安全但慢的代码。比如C语言可以写出非常快的代码，但容易出现内存错误；Java提供了安全的抽象，但垃圾回收会带来性能损失。

Rust的零成本抽象打破了这种权衡。你可以同时拥有：
- 高级抽象的安全性
- 低级代码的性能
- 编译时的错误检查

**实际开发中的意义：**
想象一下，如果你是一个游戏开发者。你需要处理大量的游戏对象Object，每个对象都有位置、速度、生命值等属性。你希望代码既安全又高效：
避免数组越界、空指针等错误。每秒处理60帧，每帧处理数千个对象。代码要容易理解和维护

零成本抽象让你可以写出既安全又高效的代码，而不需要在这两者之间妥协。

### 5.5.3 C和C++的问题

**C语言的问题：**

C语言几乎没有抽象机制，所有事情都要手动处理：

```c
// C语言：手动管理数组
int arr[] = {1, 2, 3, 4, 5};
int sum = 0;
for (int i = 0; i < 5; i++) {
    sum += arr[i];  // 容易越界
}

// 如果要安全，需要额外的检查
int sum_safe(int* arr, int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        if (i < size) {  // 冗余检查
            sum += arr[i];
        }
    }
    return sum;
}
```

**C++的问题：**

C++提供了抽象，但经常带来性能损失：

```cpp
// C++：使用STL容器
std::vector<int> vec = {1, 2, 3, 4, 5};
int sum = 0;
for (auto it = vec.begin(); it != vec.end(); ++it) {
    sum += *it;  // 迭代器可能比直接索引慢
}

// 或者使用范围for循环
int sum2 = 0;
for (const auto& item : vec) {
    sum2 += item;  // 可能有额外的开销
}
```

**C++抽象的成本：**

1. **虚函数调用**：虚函数需要查表，比直接函数调用慢
2. **模板实例化**：每个类型都会生成不同的代码，增加编译时间和二进制大小
3. **异常处理**：异常机制需要额外的运行时支持
4. **RAII开销**：构造函数和析构函数可能带来不必要的开销

### 5.5.4 Rust的零成本抽象实现

**迭代器对比：**

```rust
// Rust：使用迭代器
fn sum_with_iterator(arr: &[i32]) -> i32 {
    arr.iter().sum()  // 高级抽象
}

// 手写循环
fn sum_with_loop(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in arr {
        sum += item;
    }
    sum
}

// 编译后，这两种方法的性能几乎相同。
// rustc可以把性能优化到跟C语言几乎相同的性能
```

**泛型对比：**

```rust
// Rust：泛型函数
fn max<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

// 使用泛型
let max_int = max(10, 20);
let max_float = max(3.14, 2.71);

// 编译时，Rust会为每个具体类型生成专门的代码
// 就像手写了两个不同的函数一样
```

**Trait对象：**

```rust
// Rust：trait对象（动态分发）
trait Drawable {
    fn draw(&self);
}

struct Circle;
struct Square;

impl Drawable for Circle {
    fn draw(&self) { /* 画圆 */ }
}

impl Drawable for Square {
    fn draw(&self) { /* 画方 */ }
}

// 使用trait对象
fn draw_all(shapes: &[Box<dyn Drawable>]) {
    for shape in shapes {
        shape.draw();  // 动态分发，但开销很小
    }
}
```

### 5.5.5 零成本抽象的技术原理

**编译时优化：**
Rust编译器非常智能，能够：
- 内联函数调用
- 消除死代码
- 优化内存布局
- 进行常量折叠

**单态化（Monomorphization）：**
对于泛型代码，Rust会为每个具体类型生成专门的代码：

```rust
// 泛型函数
fn process<T>(data: T) -> T {
    // 处理逻辑
}

// 编译器会生成：
fn process_i32(data: i32) -> i32 { /* 专门处理i32的代码 */ }
fn process_string(data: String) -> String { /* 专门处理String的代码 */ }
```

**所有权系统的优化：**
Rust的所有权系统在编译时就能确定内存布局，避免了运行时的开销：

```rust
// 编译时就知道内存布局
struct Point {
    x: f64,
    y: f64,
}

// 编译器可以优化内存访问模式
let points = vec![Point { x: 1.0, y: 2.0 }];
```

### 5.5.6 实际性能对比

**内存安全 vs 性能：**

```c
// C语言：快速但不安全
int* create_array(int size) {
    return malloc(size * sizeof(int));  // 可能失败
}

void use_array(int* arr, int size) {
    for (int i = 0; i <= size; i++) {  // 越界！
        arr[i] = i;
    }
}
```

```rust
// Rust：安全且高效
fn create_array(size: usize) -> Vec<i32> {
    vec![0; size]  // 自动处理内存分配
}

fn use_array(arr: &mut [i32]) {
    for (i, item) in arr.iter_mut().enumerate() {
        *item = i as i32;  // 不可能越界
    }
}
```

**编译后性能：**
Rust的代码在编译后通常与手写的C代码性能相同，但提供了内存安全保证。



## 5.6 包管理和模块系统

### 5.6.1 C语言的模块管理

**C语言的头文件和源文件：**
```c
// math.h
#ifndef MATH_H
#define MATH_H

int add(int a, int b);
int multiply(int a, int b);

#endif

// math.c
#include "math.h"

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

// main.c
#include <stdio.h>
#include "math.h"

int main() {
    int result1 = add(5, 3);
    int result2 = multiply(4, 6);
    printf("5 + 3 = %d\n", result1);
    printf("4 * 6 = %d\n", result2);
    return 0;
}
```

### 5.6.2 Rust的模块系统

**Rust的模块组织：**
```rust
// lib.rs 或 main.rs
mod math {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
    
    pub fn multiply(a: i32, b: i32) -> i32 {
        a * b
    }
}

fn main() {
    let result1 = math::add(5, 3);
    let result2 = math::multiply(4, 6);
    println!("5 + 3 = {}", result1);
    println!("4 * 6 = {}", result2);
}
```

**使用外部依赖：**
```rust
// Cargo.toml
// [dependencies]
// serde = "1.0"
// serde_json = "1.0"

use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let person = Person {
        name: "张三".to_string(),
        age: 25,
    };
    
    let json = serde_json::to_string(&person).unwrap();
    println!("JSON: {}", json);
}
```

C语言使用头文件来声明函数和变量，这种方式简单但容易出现重复包含和依赖管理问题。Rust的模块系统更加现代化，提供了更好的封装和依赖管理。Cargo作为包管理器，自动处理依赖关系，大大简化了项目的构建过程。

## 5.7 总结对比

| 特性 | C语言 | Rust |
|------|-------|------|
| 类型系统 | 静态类型，需显式声明 | 静态类型，支持类型推断 |
| 内存管理 | 手动管理 | 所有权机制自动管理 |
| 错误处理 | 返回码/异常 | Result/Option类型 |
| 并发安全 | 需手动保证 | 编译期检查 |
| 抽象能力 | 宏/函数指针 | 泛型/Trait |
| 包管理 | 手动管理 | Cargo统一管理 |
| 编译速度 | 快 | 较慢（安全检查） |
| 运行时性能 | 高 | 高（零成本抽象） |
| 安全性 | 低（需开发者保证） | 高（编译期保证） |

## 5.8 思考题

1. Rust的所有权机制如何解决C语言中的内存泄漏问题？
2. 为什么Rust的编译时间比C语言长？这种权衡值得吗？
3. Rust的Result类型相比C语言的错误码有什么优势？
4. 试比较C语言的指针和Rust的引用在安全性方面的差异。
5. Rust的零成本抽象是如何实现的？请举例说明。
