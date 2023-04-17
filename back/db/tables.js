// Create Roles table
const rolesTable = `CREATE TABLE IF NOT EXISTS Roles (
  RoleID VARCHAR(250) PRIMARY KEY,
  RoleName VARCHAR(100) NOT NULL UNIQUE
)`;

// Create Cities table
const citiesTable = `CREATE TABLE IF NOT EXISTS Cities (
  CityID VARCHAR(250) PRIMARY KEY,
  CityName VARCHAR(100) NOT NULL UNIQUE
)`;

// Create Payment_Method table
const paymentMethod = `CREATE TABLE IF NOT EXISTS Payment_Method (
  PaymentID INT NOT NULL PRIMARY KEY,
  Card varchar(50),
  Address varchar(50) NOT NULL,
  PaymentMethod varchar(50) NOT NULL
)`;

// Create Users table
const users = `CREATE TABLE IF NOT EXISTS Users (
  UserID VARCHAR(250) PRIMARY KEY,
  CityID VARCHAR(250) REFERENCES Cities (CityID),
  PaymentID VARCHAR(250) REFERENCES Payment_Method (PaymentID),
  RoleID VARCHAR(250) REFERENCES Roles (RoleID),
  Name VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  EmailAddress VARCHAR(255) NOT NULL UNIQUE,
  Phone Char(20),
  Active BIT DEFAULT 1
)`;

// Create Types table
const types = `CREATE TABLE IF NOT EXISTS Types (
  TypeID VARCHAR(250) PRIMARY KEY,
  TypeName VARCHAR(100) NOT NULL UNIQUE
)`;

// Create Lease_team table
const leaseTeam = `CREATE TABLE IF NOT EXISTS Lease_team (
  LeaseID VARCHAR(250) PRIMARY KEY,
  LeaseName VARCHAR(100) NOT NULL UNIQUE
)`;

// Create Workspaces table
const workspaces = `CREATE TABLE IF NOT EXISTS Workspaces (
  WorkspaceID VARCHAR(250) PRIMARY KEY,
  PropertyName varchar(50) UNIQUE,
  PropertyAddress varchar(50),
  CityID VARCHAR(250) REFERENCES Cities (CityID),
  PostalCode VARCHAR(10),
  GoogleMap varchar(250),
  TypeID VARCHAR(250) REFERENCES Types (TypeID),
  Size varchar(50),
  NoOfCoworker INT,
  Parking TEXT,
  Smoking TEXT,
  DateAvailable DATETIME,
  LeaseID VARCHAR(250) REFERENCES Lease_team (LeaseID),
  Price Money,
  UserID VARCHAR(250) REFERENCES Users (UserID),
  Availability TEXT,
  BookingStartDate DATETIME,
  BookingEndDate DATETIME,
  ReachTransp varchar(5)
)`;

// Create Booking table
const booking = `CREATE TABLE IF NOT EXISTS Booking(
  BookingID VARCHAR(250) PRIMARY KEY,
  UserID VARCHAR(250) REFERENCES Users (UserID),
  WorkspaceID VARCHAR(250) REFERENCES Workspaces (WorkspaceID),
  BookingStartDate DATETIME,
  BookingEndDate DATETIME,
  CreationDate DATETIME
)`;

// Create Images table
const images = `CREATE TABLE IF NOT EXISTS Images(
  ImageID VARCHAR(250) NOT NULL PRIMARY KEY,
  image_URL VARCHAR (200) NOT NULL
)`;

// Create Workspaces_Image table
const workspacesImage = `CREATE TABLE IF NOT EXISTS Workspaces_Image (
  Workspace_ImageID VARCHAR(250) PRIMARY KEY,
  ImageID VARCHAR(250) REFERENCES Images(ImageID),
  WorkspaceID VARCHAR(250) REFERENCES Workspaces (WorkspaceID) ON DELETE CASCADE
)`;

export default {
  rolesTable,
  citiesTable,
  paymentMethod,
  users,
  types,
  leaseTeam,
  workspaces,
  booking,
  images,
  workspacesImage,
};
