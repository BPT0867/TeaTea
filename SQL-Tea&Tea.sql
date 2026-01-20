-- 1. TẠO DATABASE
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'TeaTeaDB')
BEGIN
    CREATE DATABASE TeaTeaDB;
END
GO

USE TeaTeaDB;
GO

-- 2. TẠO CÁC BẢNG (TABLES)

-- Bảng Roles
IF OBJECT_ID('Roles', 'U') IS NULL
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

-- Bảng Users
IF OBJECT_ID('Users', 'U') IS NULL
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    Address NVARCHAR(255),
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Bảng Categories
IF OBJECT_ID('Categories', 'U') IS NULL
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL
);

-- Bảng Products
IF OBJECT_ID('Products', 'U') IS NULL
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 0) NOT NULL,
    ImageURL VARCHAR(MAX),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    IsActive BIT DEFAULT 1
);

-- Bảng Orders
IF OBJECT_ID('Orders', 'U') IS NULL
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(18, 0),
    Status NVARCHAR(50) DEFAULT N'Chờ xác nhận', -- Các trạng thái: Chờ xác nhận, Đang giao, Hoàn thành, Hủy
    ShippingAddress NVARCHAR(255) NOT NULL,
    PaymentMethod NVARCHAR(50) DEFAULT 'COD'
);

-- Bảng OrderDetails
IF OBJECT_ID('OrderDetails', 'U') IS NULL
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18, 0) NOT NULL
);

GO

-- 3. THÊM DỮ LIỆU MẪU (SEEDING DATA)

-- Thêm Roles
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Customer');

-- Thêm Categories
INSERT INTO Categories (CategoryName) VALUES (N'Trà Sữa'), (N'Trà Trái Cây'), (N'Topping');

-- Thêm Admin mẫu (Pass: 123456 - Lưu ý: đây chưa mã hóa, sau này code Nodejs sẽ mã hóa sau)
INSERT INTO Users (FullName, Email, PasswordHash, Phone, RoleID) 
VALUES (N'Quản Trị Viên', 'admin@teatea.com', '123456', '0909000111', 1);

-- Thêm Khách hàng mẫu
INSERT INTO Users (FullName, Email, PasswordHash, Phone, Address, RoleID) 
VALUES (N'Nguyễn Văn A', 'user@gmail.com', '123456', '0909000222', N'123 Đường Láng, Hà Nội', 2);

-- Thêm Sản phẩm mẫu
INSERT INTO Products (ProductName, Price, CategoryID, ImageURL) VALUES 
(N'Trà Sữa Truyền Thống', 25000, 1, 'ts-truyen-thong.jpg'),
(N'Trà Sữa Trân Châu Đường Đen', 35000, 1, 'ts-tran-chau.jpg'),
(N'Trà Đào Cam Sả', 30000, 2, 'tra-dao.jpg'),
(N'Trân Châu Trắng', 5000, 3, 'topping-trang.jpg');

PRINT 'Tạo Database và dữ liệu mẫu thành công!';