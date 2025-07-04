# 第N章 Rust的trait+struct与C++类的对比

## 引子：从面向对象到组合优于继承

如果你有C++基础，那么你一定熟悉类和对象的概念。在C++中，我们通过类来封装数据和方法，通过继承来实现代码复用和多态。但是，Rust采用了完全不同的设计哲学。

**Rust没有传统的类，而是用struct来存储数据，用trait来定义行为。** 这种设计不是偶然的，而是Rust对现代软件设计理念的深刻思考。

想象一下，你正在设计一个图形系统。在C++中，你可能会这样设计：

```cpp
// 形状基类
class Shape {
public:
    virtual double area() = 0;
    virtual void draw() = 0;
};

// 圆继承了shape
class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() override { return 3.14159 * radius * radius; }
    void draw() override { /* 绘制圆形 */ }
};

// 长方形继承了shape
class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() override { return width * height; }
    void draw() override { /* 绘制矩形 */ }
};
```

这种设计看起来很自然，但当设计的结构复杂之后，就会更加复杂。
Rust的设计者认为，**继承往往会导致代码耦合过紧，而组合更加灵活和可维护**。

## Rust的设计哲学：组合优于继承

### 为什么Rust选择trait而不是继承？

#### 避免"钻石问题"
在C++中，多重继承会导致著名的"钻石问题"：

```cpp
class Animal {
public:
    virtual void eat() { cout << "动物在吃东西" << endl; }
};

class Bird : public Animal {
public:
    void fly() { cout << "鸟在飞" << endl; }
};

class Fish : public Animal {
public:
    void swim() { cout << "鱼在游泳" << endl; }
};

// 企鹅既是鸟又是鱼？这会导致钻石问题
class Penguin : public Bird, public Fish {
    // 企鹅从Bird和Fish都继承了Animal，导致Animal的成员重复
};
```
画出类的层次图，这就依赖关系变成了钻石形。

**Rust如何避免钻石问题？**

Rust通过trait避免了这个问题，因为trait只是定义接口，不包含数据。让我们看看Rust的解决方案：

```rust
// 定义行为trait，不包含数据
trait Eatable {
    fn eat(&self);
}

trait Flyable {
    fn fly(&self);
}

trait Swimmable {
    fn swim(&self);
}

// 具体的动物类型
struct Bird {
    name: String,
}

struct Fish {
    name: String,
}

struct Penguin {
    name: String,
}

// 为每种动物实现相应的trait
impl Eatable for Bird {
    fn eat(&self) {
        println!("{}在吃虫子", self.name);
    }
}

impl Flyable for Bird {
    fn fly(&self) {
        println!("{}在飞", self.name);
    }
}

impl Eatable for Fish {
    fn eat(&self) {
        println!("{}在吃水草", self.name);
    }
}

impl Swimmable for Fish {
    fn swim(&self) {
        println!("{}在游泳", self.name);
    }
}

// 企鹅只实现它能做的行为
impl Eatable for Penguin {
    fn eat(&self) {
        println!("{}在吃鱼", self.name);
    }
}

// 企鹅不能飞，所以不实现Flyable
// 企鹅不能游泳，所以不实现Swimmable
```
其实就是struct和trait两两组合，让我们设计程序变得扁平化。而class会存在复杂的依赖关系。


**关键区别：**

- **没有数据重复**：trait只定义方法签名，不包含数据字段，所以不存在"Animal的成员重复"问题。

- **按需实现**：企鹅只实现它真正具备的能力（吃），不实现它不具备的能力（飞、游泳）。

- **组合而非继承**：如果需要企鹅同时具备多种能力，可以用组合的方式：

    ```rust
    // 如果需要企鹅同时具备多种能力，可以用组合
    struct Penguin {
        name: String,
        // 可以组合其他类型
        swimming_ability: Option<SwimmingHelper>,
    }

    struct SwimmingHelper {
        // 游泳相关的辅助数据
    }

    impl Swimmable for Penguin {
        fn swim(&self) {
            if let Some(_) = &self.swimming_ability {
                println!("{}在游泳", self.name);
            } else {
                println!("{}不会游泳", self.name);
            }
        }
    }
    ```

- **类型安全**：编译器会确保你只调用类型真正实现的方法，避免了**运行时错误**。


#### 更灵活的代码复用

在C++中，如果你想复用某个类的功能，通常需要继承它。但在Rust中，你可以为任何类型实现任何trait，只要这个类型满足trait的要求。

想象一下，你正在开发一个游戏系统。在C++中，如果你想让一个类具备"可序列化"的能力，你需要继承一个Serializable基类。但如果这个类已经继承了其他基类，就会遇到多重继承的问题。更糟糕的是，如果你想让标准库的类型（比如std::string）具备序列化能力，你无法修改标准库的代码。

Rust的trait解决了这个问题。你可以为任何类型实现任何trait，包括标准库的类型。比如，你想让一个自定义的Player类型具备序列化能力：

```rust
use serde::{Serialize, Deserialize};

// 定义你的游戏玩家类型
struct Player {
    name: String,
    level: u32,
    health: f32,
}

// 为Player实现序列化trait
impl Serialize for Player {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        // 序列化逻辑
        serializer.serialize_struct("Player", 3, |state| {
            state.serialize_field("name", &self.name)?;
            state.serialize_field("level", &self.level)?;
            state.serialize_field("health", &self.health)?;
            Ok(())
        })
    }
}

// 你甚至可以为标准库的类型实现自定义trait
trait GameObject {
    fn get_id(&self) -> String;
}

// 为标准库的String实现GameObject trait
impl GameObject for String {
    fn get_id(&self) -> String {
        format!("string_{}", self.len())
    }
}

// 为你的Player也实现GameObject trait
impl GameObject for Player {
    fn get_id(&self) -> String {
        format!("player_{}", self.name)
    }
}
```

这种设计让你可以轻松地为任何类型添加新功能，而不需要修改原始类型的定义。你可以为第三方库的类型实现你的trait，也可以为你的类型实现第三方库的trait。这种灵活性让代码复用变得更加简单和强大。

#### 零成本抽象

Rust的trait在编译时会被单态化，这意味着没有运行时开销，性能与手写的代码一样好。

让我们通过一个具体的例子来理解这个概念。假设你正在开发一个图形渲染系统，需要计算不同形状的面积。在C++中，如果你使用虚函数来实现多态，每次调用都会有运行时开销，因为程序需要在运行时查找正确的方法实现。

```cpp
// C++的虚函数方式
class Shape {
public:
    virtual double area() const = 0;  // 虚函数，运行时查找
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
};

// 使用虚函数，有运行时开销
void print_areas(const std::vector<Shape*>& shapes) {
    for (const auto& shape : shapes) {
        std::cout << "面积: " << shape->area() << std::endl;  // 虚函数调用
    }
}
```

在Rust中，你可以使用泛型trait bound来实现零成本抽象：

```rust
trait Shape {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

struct Rectangle {
    width: f64,
    height: f64,
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

// 使用泛型trait bound，编译时单态化，零运行时开销
fn print_area<T: Shape>(shape: &T) {
    println!("面积: {}", shape.area());  // 编译时确定调用，无运行时开销
}

// 或者使用impl trait语法
fn print_area(shape: &impl Shape) {
    println!("面积: {}", shape.area());  // 同样零运行时开销
}

fn main() {
    let circle = Circle { radius: 5.0 };
    let rectangle = Rectangle { width: 4.0, height: 6.0 };
    
    // 编译器会为每种类型生成专门的函数版本
    print_area(&circle);      // 调用Circle::area
    print_area(&rectangle);   // 调用Rectangle::area
}
```

编译器会为每种类型生成专门的函数版本，就像你手写了两个不同的函数一样。这意味着：

1. **零运行时开销**：没有虚函数表查找，没有动态分发
2. **编译时优化**：编译器可以对每种类型进行专门的优化
3. **内联友好**：方法调用可以被内联，进一步提高性能

**等等，C++不是也有模板吗？**

C++模板的问题是，它使用"鸭子类型"：**只要类型有area方法就可以编译通过**（这对于写惯了的Rust程序员来说很恐怖！！！）。这听起来很灵活，但实际上会导致一些问题：

```cpp
// C++模板的问题：编译错误信息不友好
template<typename T>
void print_area(const T& shape) {
    std::cout << "面积: " << shape.area() << std::endl;
}

struct Point {
    int x, y;
    // 没有area方法
};

int main() {
    Point p{1, 2};
    print_area(p);  // 编译错误，但错误信息可能很复杂
    return 0;
}
```

当你编译这段代码时，可能会得到类似这样的错误信息：
```
error: no member named 'area' in 'Point'
```

这个错误信息不够清晰，特别是当模板嵌套很深时，错误信息会变得非常复杂。

**Rust的trait提供了更好的解决方案：**

```rust
trait Shape {
    fn area(&self) -> f64;
}

fn print_area<T: Shape>(shape: &T) {
    println!("面积: {}", shape.area());
}

struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    print_area(&p);  // 编译错误，但错误信息很清晰
}
```

Rust会给出清晰的错误信息：
```
error[E0277]: the trait bound `Point: Shape` is not satisfied
  --> src/main.rs:15:5
   |
15 |     print_area(&p);
   |     ^^^^^^^^^^^ the trait `Shape` is not implemented for `Point`
   |
   = help: the trait `Shape` is defined here
   = note: required by `print_area`
```

**Rust trait的优势：**

Rust的trait相比C++模板提供了更明确的接口定义。当你定义一个trait时，你明确定义了类型需要实现什么方法，这就像是一个契约，告诉编译器和其他开发者这个类型应该具备什么能力。这种明确的接口定义让代码更容易理解和维护。

当类型不满足trait要求时，Rust编译器会给出非常清晰的错误信息。编译器能准确告诉你缺少什么trait实现，甚至会提供帮助信息告诉你如何修复这个问题。相比之下，C++模板的错误信息往往很复杂，特别是当模板嵌套很深时，错误信息会变得难以理解。

trait本身就是最好的接口文档。当你看到一个函数接受`T: Shape`参数时，你立即就知道这个类型必须实现Shape trait，也就是必须有一个area方法。这种自文档化的特性让代码更容易理解，也更容易重构。

Rust的trait系统在编译时就能确保类型实现了所有必需的方法。这种编译时检查比C++模板的"鸭子类型"更安全，因为它能提前发现类型不匹配的问题，而不是等到实际使用时才发现。

最后，trait系统为IDE提供了更好的支持。IDE能够准确知道一个类型实现了哪些trait，从而提供更准确的代码补全和重构建议。这种开发体验的提升在大型项目中特别明显。

如果你确实需要运行时多态（比如在运行时决定使用哪种类型），Rust也提供了trait object：

```rust
// 使用trait object，有运行时开销（但比C++的虚函数更高效）
fn print_areas(shapes: &[Box<dyn Shape>]) {
    for shape in shapes {
        println!("面积: {}", shape.area());  // 动态分发，有运行时开销
    }
}
```

这种设计让你可以根据具体需求选择性能最优的方案：当你需要在编译时确定类型时，使用泛型trait bound获得零成本抽象；当你需要在运行时处理不同类型的对象时，使用trait object获得灵活性。

## Rust的struct：纯数据容器

### struct vs class：数据与行为的分离

在C++中，类既包含数据又包含方法：

```cpp
class Point {
private:
    int x, y;
public:
    Point(int x, int y) : x(x), y(y) {}
    int getX() const { return x; }
    int getY() const { return y; }
    void setX(int x) { this->x = x; }
    void setY(int y) { this->y = y; }
    double distance() const { return sqrt(x*x + y*y); }
};
```

在Rust中，struct只负责存储数据：

```rust
struct Point {
    x: i32,
    y: i32,
}
```

**这种分离有什么好处？**

- **更清晰的责任划分**：struct只关心"是什么"，trait关心"能做什么"
- **更容易测试**：你可以单独测试数据结构和行为
- **更灵活的组合**：同一个struct可以实现多个trait

### 实现方法：impl块

在Rust中，我们通过impl块为struct添加方法：

```rust
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    // 构造函数（Rust没有构造函数，这是约定俗成的方法）
    fn new(x: i32, y: i32) -> Point {
        Point { x, y }
    }
    
    // 实例方法
    fn get_x(&self) -> i32 {
        self.x
    }
    
    fn get_y(&self) -> i32 {
        self.y
    }
    
    fn set_x(&mut self, x: i32) {
        self.x = x;
    }
    
    fn set_y(&mut self, y: i32) {
        self.y = y;
    }
    
    fn distance(&self) -> f64 {
        ((self.x * self.x + self.y * self.y) as f64).sqrt()
    }
}
```

**与C++的对比：**
- C++的方法在类内部定义，Rust的方法在impl块中定义
- C++有构造函数，Rust通常用`new`方法作为构造函数
- C++的方法默认可以修改对象，Rust需要显式使用`&mut self`

## Rust的trait：行为的抽象

### trait vs 抽象类：接口的重新定义

在C++中，抽象类用于定义接口：

```cpp
class Drawable {
public:
    virtual void draw() = 0;
    virtual ~Drawable() = default;
};

class Circle : public Drawable {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    void draw() override { cout << "绘制圆形" << endl; }
};
```

在Rust中，trait定义行为：

```rust
trait Drawable {
    fn draw(&self);
}

struct Circle {
    radius: f64,
}

impl Drawable for Circle {
    fn draw(&self) {
        println!("绘制圆形");
    }
}
```

**关键区别：**

1. **实现方式**：C++通过继承实现，Rust通过impl块实现
2. **灵活性**：Rust可以为任何类型实现任何trait（包括标准库类型）
3. **默认实现**：Rust的trait可以提供默认实现

### trait的默认实现

Rust的trait可以提供默认实现，这比C++的抽象类更灵活：

```rust
trait Drawable {
    fn draw(&self) {
        println!("默认绘制方法");
    }
    
    fn description(&self) -> &str {
        "一个可绘制的对象"
    }
}

struct Circle {
    radius: f64,
}

// 只需要实现特定的方法，其他方法使用默认实现
impl Drawable for Circle {
    fn draw(&self) {
        println!("绘制半径为{}的圆形", self.radius);
    }
}
```

### trait作为参数：泛型编程的威力

Rust的trait可以作为函数参数，这比C++的虚函数更灵活：

```rust
fn draw_shape(shape: &impl Drawable) {
    shape.draw();
}

// 或者使用trait bound语法
fn draw_shape<T: Drawable>(shape: &T) {
    shape.draw();
}

// 多个trait bound
fn process_shape<T: Drawable + Clone>(shape: &T) {
    shape.draw();
    let cloned = shape.clone();
    // ...
}
```

在C++中，你需要使用虚函数或者模板：

```cpp
// 虚函数方式
void draw_shape(Drawable* shape) {
    shape->draw();
}

// 模板方式
template<typename T>
void draw_shape(T& shape) {
    shape.draw();
}
```

## 实际对比：图形系统设计

让我们通过一个完整的例子来对比两种设计方式。

### C++的面向对象设计

```cpp
#include <iostream>
#include <vector>
#include <memory>

class Shape {
public:
    virtual double area() const = 0;
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
    void draw() const override { std::cout << "绘制圆形" << std::endl; }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
    void draw() const override { std::cout << "绘制矩形" << std::endl; }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    
    for (const auto& shape : shapes) {
        shape->draw();
        std::cout << "面积: " << shape->area() << std::endl;
    }
    return 0;
}
```

### Rust的trait设计

```rust
trait Shape {
    fn area(&self) -> f64;
    fn draw(&self);
}

struct Circle {
    radius: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
    
    fn draw(&self) {
        println!("绘制圆形");
    }
}

struct Rectangle {
    width: f64,
    height: f64,
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
    
    fn draw(&self) {
        println!("绘制矩形");
    }
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 5.0 }),
        Box::new(Rectangle { width: 4.0, height: 6.0 }),
    ];
    
    for shape in shapes {
        shape.draw();
        println!("面积: {}", shape.area());
    }
}
```

### 关键差异分析

**1. 继承 vs 实现**
- C++：Circle和Rectangle继承自Shape
- Rust：Circle和Rectangle实现Shape trait

**2. 内存管理**
- C++：使用智能指针管理对象生命周期
- Rust：所有权系统自动管理内存

**3. 多态性**
- C++：通过虚函数实现运行时多态
- Rust：通过trait对象实现运行时多态

**4. 扩展性**
- C++：如果要为现有类型添加新行为，需要修改类定义
- Rust：可以为任何类型实现任何trait，包括标准库类型

## 高级特性对比

### 关联类型 vs 模板

C++使用模板来实现泛型编程：

```cpp
template<typename T>
class Container {
private:
    T data;
public:
    T get() const { return data; }
    void set(const T& value) { data = value; }
};
```

Rust使用关联类型：

```rust
trait Container {
    type Item;
    
    fn get(&self) -> &Self::Item;
    fn set(&mut self, value: Self::Item);
}

struct MyContainer<T> {
    data: T,
}

impl<T> Container for MyContainer<T> {
    type Item = T;
    
    fn get(&self) -> &Self::Item {
        &self.data
    }
    
    fn set(&mut self, value: Self::Item) {
        self.data = value;
    }
}
```

### 孤儿规则：Rust的安全设计

Rust有一个重要的规则：**孤儿规则**。它规定，你只能为你的crate中的类型实现你的crate中的trait，或者为你的crate中的类型实现外部trait。

这个规则防止了"trait实现冲突"的问题：

```rust
// 在你的crate中
struct MyType;

// 你可以为你的类型实现外部trait
impl std::fmt::Display for MyType {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "MyType")
    }
}

// 你也可以为外部类型实现你的trait
trait MyTrait {
    fn my_method(&self);
}

impl MyTrait for i32 {
    fn my_method(&self) {
        println!("整数: {}", self);
    }
}
```

C++没有这样的限制，这可能导致"钻石问题"和其他复杂性。

## 性能对比

### 编译时 vs 运行时

**C++的虚函数：**
```cpp
class Shape {
public:
    virtual double area() const = 0;  // 虚函数，运行时查找
};

class Circle : public Shape {
public:
    double area() const override { return 3.14159 * radius * radius; }
};

// 使用虚函数，有运行时开销
Shape* shape = new Circle(5.0);
double a = shape->area();  // 虚函数调用
```

**Rust的trait：**
```rust
trait Shape {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

// 使用泛型，编译时单态化，零开销
fn print_area<T: Shape>(shape: &T) {
    println!("面积: {}", shape.area());
}

// 使用trait对象，有运行时开销（但比C++的虚函数更高效）
fn print_area_dyn(shape: &dyn Shape) {
    println!("面积: {}", shape.area());
}
```

**性能特点：**
- Rust的泛型trait在编译时单态化，没有运行时开销
- Rust的trait对象使用vtable，但比C++的虚函数更高效
- C++的虚函数总是有运行时开销

## 实际应用场景

### 什么时候用C++的类？

1. **传统的面向对象设计**：当你需要继承层次结构时
2. **需要修改现有类型**：当你需要为现有类添加新方法时
3. **团队习惯**：当团队更熟悉面向对象编程时

### 什么时候用Rust的trait+struct？

1. **组合优于继承**：当你想要更灵活的代码复用时
2. **零成本抽象**：当你需要高性能的泛型编程时
3. **类型安全**：当你需要编译时保证类型安全时
4. **扩展性**：当你需要为现有类型添加新行为时


## Rust设计哲学的深度解析：为什么没有类继承是好事

这段是我在reddit里面看到的回答，我总结一下。

### 核心观点：Rust没有"实现继承"是明智的设计选择

**实现继承**指的是传统OOP语言中的类继承机制，即一个具体类型X可以继承自另一个具体类型Y，X可以被当作Y使用，并且能复用Y的实现。Rust的设计者认为，这种继承机制往往会导致代码设计上的问题，因此Rust选择不提供这种特性。

### Rust保留了OOP的所有优点

#### 1. 方法（Methods）
Rust的struct和impl块提供了与OOP类方法完全相同的功能。你可以为struct定义实例方法，包括构造函数、getter/setter方法、业务逻辑方法等。这些方法可以访问struct的字段，并且支持可变引用和不可变引用，完全满足OOP中方法的需求。

#### 2. 封装（Encapsulation）
Rust的封装机制比传统OOP语言更强大。字段默认是私有的，只有当前模块可以访问。Rust提供了多种可见性修饰符：完全公开、crate内可见、父模块可见、指定路径内可见等。这种细粒度的可见性控制让代码的封装更加精确和安全。

#### 3. 接口和多态（Interfaces and Polymorphism）
Rust的trait比传统OOP的接口更强大。trait不仅可以定义带self的方法，还能定义静态方法（不需要self），还能提供默认实现。trait既可以静态分发（零运行时开销），也可以用trait object实现动态分发（和OOP的多态类似）。一个struct可以实现多个trait，提供了比单继承更灵活的组合能力。

### 为什么Rust没有"具体类型继承"？

#### 1. 类型安全性和清晰性
在传统OOP中，当你有一个基类指针或引用时，你往往不知道它具体指向什么子类。这种不确定性会导致代码难以理解和维护。在Rust中，如果你有具体的struct，你就明确知道它是什么类型。如果你需要多态，必须明确使用trait object，这样类型系统会保证安全性，同时代码的意图也更加清晰。

#### 2. 避免设计上的混乱
传统OOP的继承经常被滥用，导致"钻石继承"等复杂问题。多重继承会让类型关系变得复杂，难以理解和维护。Rust用组合和trait来解决这些问题，让代码结构更加清晰，职责划分更加明确。

#### 3. 强制更好的设计思考
Rust的设计哲学是"组合优于继承"。当你不能使用继承时，你被迫思考更好的设计方式。这往往会导致更清晰、更模块化的代码结构。

### Rust如何替代继承的常见用途？

#### 1. 有限子类型 → Enum
传统OOP用继承来表示有限数量的子类型，比如Option、Result等。Rust用enum来处理这种情况，enum天然支持模式匹配，代码更加直观和安全。

#### 2. 抽象类 → Trait + Struct分离
传统OOP的抽象类往往混合了具体实现和抽象接口。Rust建议把"未完成的部分"抽象成trait，把"完成的部分"做成struct，这样职责更加清晰，代码更容易测试和维护。

#### 3. Mixin和多重继承 → Trait组合
传统OOP用多重继承来实现mixin功能。Rust用trait组合来实现，避免了多重继承的复杂性，同时提供了更灵活的组合能力。

#### 4. 自动生成方法 → Derive宏
传统OOP语言需要手动实现equals、hashCode、toString等方法。Rust用derive宏来自动生成这些方法，一行代码就能解决，同时支持模式匹配等高级功能。

### Rust的设计优势

#### 1. 零成本抽象
Rust的trait在编译时会被单态化，静态分发的trait调用没有运行时开销，性能与手写的代码一样好。只有在使用trait object时才会有动态分发的开销。

#### 2. 编译时类型安全
Rust的类型系统在编译时就能发现很多潜在的错误，包括trait实现的完整性检查、生命周期检查等，大大减少了运行时错误。

#### 3. 更清晰的代码结构
Rust强制你明确区分"行为抽象"和"具体数据结构"，让代码的意图更加清晰，更容易理解和维护。

### 思维转换：从OOP到Rust

如果你有C++或Java背景，需要转变思维方式：

- 不要问"如何用继承实现这个功能"，而要问"如何用trait和struct组合实现"
- 不要问"如何设计继承层次"，而要问"如何设计trait接口和struct组合"
- 不要问"如何实现多态"，而要问"是用泛型trait bound还是trait object"


## 小结：两种设计哲学的对比

### C++的面向对象哲学

**优点：**
- 直观的继承关系
- 成熟的生态系统
- 丰富的设计模式

**缺点：**
- 继承层次复杂
- 虚函数运行时开销
- 难以扩展现有类型

### Rust的组合哲学

**优点：**
- 灵活的代码复用
- 零成本抽象
- 编译时类型安全
- 易于扩展现有类型

**缺点：**
- 学习曲线较陡
- 需要重新思考设计
- 生态系统相对较新

### Reference

1. https://www.reddit.com/r/rust/comments/1d3hvhw/why_rust_doesnt_have_classes/