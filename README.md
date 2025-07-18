[English Version](README.en.md)

# 本书介绍

## 为什么要有这本书？

很多人觉得 Rust 难学，第一反应是"这门语言语法太怪了"，"所有权、生命周期太抽象了"。但实际上，**大部分人学不会 Rust，并不是因为 Rust 本身有多难，而是因为缺乏计算机基础知识**。

在实际教学和培训中，我们发现一个有趣的现象：
- 很多同学虽然学过 C 语言，但对内存、进程、线程、文件系统、编译原理等底层知识并不扎实
- 一旦遇到 Rust 的所有权、借用、并发安全等设计理念，就会觉得"无从下手"，其实是因为底层原理没打好基础
- 很多 Rust 的"难点"，其实是现代系统编程的通用难点，只不过 Rust 让你必须正视它们

**这本书的最大特色，就是在 Rust 学习过程中，穿插讲解计算机基础知识，也就是"内力"。**

你不仅能学到 Rust 的语法和工程实践，还能系统梳理计算机组成、内存管理、操作系统、并发原理等底层知识。很多 Rust 的设计点，都会结合其他语言（更多是C/C++）和底层原理对比讲解，帮助你建立"迁移思维"。

这样学 Rust，不仅能写出高质量代码，更能打下坚实的计算机基础，为后续学习任何系统级开发打好底子。

## 用最简单的语言，讲最深刻的道理

**这本书的另一个特色，就是用最简单、最通俗的语言来讲解 Rust。**

我们相信，任何复杂的概念都可以用简单的话说清楚。比如：
- 所有权机制？就像你借书给朋友，要么你失去这本书，要么朋友用完还给你
- 生命周期？就像食物的保质期，过期了就不能用了
- 并发安全？就像多个人同时用一台打印机，需要排队和协调

**我们尽量避免晦涩的术语堆砌，多用生活中的类比、图示、流程图来帮助理解。** 每一个知识点都会配有实际的代码示例，理论讲解之后，马上就能动手实践，做到"学以致用"。

## AI 时代，为什么更要修炼"内力"？

也许你会问：现在AI工具这么强大，写代码都能自动生成了，为什么还要花时间打基础、学底层？

**答案很简单：AI可以帮你写代码，但只有你自己理解底层原理，才能写出真正高质量、可控、安全的系统。**

AI能帮你生成函数、补全语法，但遇到复杂的系统设计、性能优化、并发安全、底层bug时，只有"内力"深厚的人才能看懂、调优、把控全局。如果你只会"用AI抄代码"，遇到AI生成的代码有隐患、性能瓶颈、架构缺陷时，你很难发现和修正。

未来AI会成为开发者的好帮手，但**只有基础扎实、理解原理的人，才能驾驭AI工具，而不是被AI限制思维和能力**。

**所以，AI时代更要修炼内力。** 你会发现，越是底层功夫扎实，越能用AI做更高效的开发、做更有创造力的系统设计。这本书希望带你"内外兼修"，让你在AI时代依然有不可替代的核心竞争力。

## 适合人群

我的初衷是希望能够照顾到多方面的人群，包括：

- **零基础小白**：本书穿插了很多计算机基础知识的通俗讲解，很多非专业人士也能看懂
- **有 C 语言基础，但对底层原理不熟悉的开发者**：我们会从C语言的角度出发，帮你理解Rust的设计理念
- **希望补齐"内力"，真正理解现代编程语言设计的同学**：我们会深入讲解底层原理，帮你建立完整的知识体系
- **想在企业、团队中推动高质量开发和工程实践的工程师**：我们会分享很多实际项目中的经验和最佳实践

> 这本书不是单纯教你 Rust 语法，而是带你"内外兼修"，让你在学 Rust 的同时，补齐计算机基础，提升底层功力，成为真正的现代系统开发者。

## 目录

- [本书介绍](./ch0.md)
- [Rust语言背景与发展](./ch1.md)
- [Rust开发工具与环境](./ch2.md)
- [计算机基础](./ch3.md)
- [程序编译与执行流程](./ch4.md)
- [Rust语言特性（与C对比）](./ch5.md)
- [变量、数据类型与基本运算](./ch6.md)
- [流程控制与模式匹配](./ch7.md)
- [版权声明](copyright.md)