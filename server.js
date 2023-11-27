const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Create a MySQL connection pool (replace the connection details with your actual database information)
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "bitrix",
});

// Check if the connection is successful
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
    connection.release(); // Release the connection
  }
});

// API to create Employees table
const createEmployeeTableQuery = `
CREATE TABLE IF NOT EXISTS employeeTable (
  userID INT AUTO_INCREMENT PRIMARY KEY,
  OrganisationID INT,
  Username VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  LastName VARCHAR(100) NOT NULL,
  ProfilePic VARCHAR(255),
  RoleId INT,
  JoinDate DATETIME,
  PhoneNumber INT,
  Address VARCHAR(200) NOT NULL,
  SocialMediaProfile VARCHAR(255), 
  UserRole VARCHAR(100) NOT NULL,
  CreatedAt DATETIME,
  UpdatedAt DATETIME
);`;

async function createEmployeeTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(createEmployeeTableQuery);
    connection.release();
    console.log("employee table created successfully");
  } catch (error) {
    console.log("Error Creatung employee Table", error);
  }
}
createEmployeeTable();

//Api to create Projects Table
const createProjectsTableQuery = `
  CREATE TABLE IF NOT EXISTS projectsTable(
    projectId INT AUTO_INCREMENT PRIMARY KEY,
    OrganizationID INT,
    ProjectName TEXT,
    Description LONGTEXT,
    StartDate DATETIME,
    EndDate DATETIME,
    Status TEXT,
    Priority TEXT,
    Progress INT,
    CreatedAt DATETIME,
    UpdatedAt DATETIME
  );
`;

async function createProjectsTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(createProjectsTableQuery);
    connection.release();
    console.log("projects table created successfully");
  } catch (error) {
    console.log("Error creating projects table", error);
  }
}
createProjectsTable();

//API to create Organizations Table
const createorganizationatable = `
  CREATE TABLE IF NOT EXISTS organizationsTable(
    organizationID INT,
    organiztionName VARCHAR(500),
    Description LONGTEXT,
    Industry TEXT,
    Address TEXT,
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100),
    PostalCode INT,
    phone INT,
    CompanyEmail VARCHAR(100),
    Website TEXT,
    ResponsiblePerson VARCHAR(100),
    CompanyRegistrationNumber VARCHAR(100),
    CompanyLogo VARCHAR(500),
    CeatedAt DATETIME,
    UpdatedAt DATETIME
  );
`;

async function createorganizationTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(createorganizationatable);
    connection.release();
    console.log("Organization table created successfully");
  } catch (error) {
    console.log("Error creating organization table", error);
  }
}
createorganizationTable();

//API to create Tasks Table
const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasktable(
    taskId INT AUTO_INCREMENT PRIMARY KEY,
    OrganisationId INT,
    taskName TEXT,
    Description LONGTEXT,
    status TEXT,
    priority TEXT,
    dueDate DATETIME,
    startDate DATETIME,
    endDate DATETIME,
    progress TEXT,
    attachments VARCHAR(1000),
    createdAt DATETIME
  );
`;

async function createTaskTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(createTasksTable);
    console.log("Task table is created successfully");
  } catch (error) {
    console.log("Error in creating tasks table", error);
  }
}
createTaskTable();

// posting the the employees details
app.post("/employees", async (req, res) => {
  try {
    const {
      OrganisationID,
      Username,
      Email,
      firstName,
      LastName,
      ProfilePic,
      RoleId,
      JoinDate,
      PhoneNumber,
      Address,
      SocialMediaProfile,
      UserRole,
      CreatedAt,
      UpdatedAt,
    } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO employeeTable
        (OrganisationID,
          Username,
          Email,
          firstName,
          LastName,
          ProfilePic,
          RoleId,
          JoinDate,
          PhoneNumber,
          Address,
          SocialMediaProfile,
          UserRole,
          CreatedAt,
          UpdatedAt)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        OrganisationID,
        Username,
        Email,
        firstName,
        LastName,
        ProfilePic,
        RoleId,
        JoinDate,
        PhoneNumber,
        Address,
        SocialMediaProfile,
        UserRole,
        CreatedAt,
        UpdatedAt,
      ]
    );
    connection.release();
    res.json({
      success: true,
      message: "Record Inserted Successfully in empployees table",
    });
  } catch (error) {
    console.error("Error inserting record in employees table:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//posting the projects details in projects table
app.post("/projects", async (req, res) => {
  try {
    const {
      OrganizationID,
      ProjectName,
      Description,
      StartDate,
      EndDate,
      Status,
      Priority,
      Progress,
      CreatedAt,
      UpdatedAt,
    } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO projectsTable(
          OrganizationID,
      ProjectName,
      Description,
      StartDate,
      EndDate,
      Status,
      Priority,
      Progress,
      CreatedAt,
      UpdatedAt
        ) VALUES(
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,?)`,
      [
        OrganizationID,
        ProjectName,
        Description,
        StartDate,
        EndDate,
        Status,
        Priority,
        Progress,
        CreatedAt,
        UpdatedAt,
      ]
    );
    connection.release();
    res.json({
      success: true,
      message: "Record Inserted Successfully in projects Table",
    });
  } catch (error) {
    console.error("Error inserting record in projects table:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Posting API to post the organization details in organization table
app.post("/organization", async (req, res) => {
  try {
    const {
      organizationID,
      organiztionName,
      Description,
      Industry,
      Address,
      City,
      State,
      Country,
      PostalCode,
      phone,
      CompanyEmail,
      Website,
      ResponsiblePerson,
      CompanyRegistrationNumber,
      CompanyLogo,
      CeatedAt,
      UpdatedAt,
    } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO organizationsTable(
          organizationID,
          organiztionName ,
          Description ,
          Industry ,
          Address ,
          City ,
          State ,
          Country ,
          PostalCode ,
          phone ,
          CompanyEmail ,
          Website ,
          ResponsiblePerson ,
          CompanyRegistrationNumber ,
          CompanyLogo ,
          CeatedAt ,
          UpdatedAt 
        )VALUES( ? ,?,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? )`,
      [
        organizationID,
        organiztionName,
        Description,
        Industry,
        Address,
        City,
        State,
        Country,
        PostalCode,
        phone,
        CompanyEmail,
        Website,
        ResponsiblePerson,
        CompanyRegistrationNumber,
        CompanyLogo,
        CeatedAt,
        UpdatedAt,
      ]
    );
    connection.release();
    res.json({
      success: true,
      message: "Record Inserted Successfully in Organiztion Table",
    });
  } catch (error) {
    console.log("Error inserting record in organization table", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addtask", async (req, res) => {
  try {
    const {
      OrganisationId,
      taskName,
      Description,
      status,
      priority,
      dueDate,
      startDate,
      endDate,
      progress,
      attachments,
      createdAt,
    } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO tasktable(
        OrganisationId,
          taskName ,
          Description ,
          status ,
          priority ,
          dueDate ,
          startDate ,
          endDate ,
          progress ,
          attachments ,
          createdAt 
         
        )VALUES(  ?,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? ,
          ? )`,
      [
        OrganisationId,
        taskName,
        Description,
        status,
        priority,
        dueDate,
        startDate,
        endDate,
        progress,
        attachments,
        createdAt,
      ]
    );
    connection.release();
    res.json({
      success: true,
      message: "Record Inserted Successfully in tasks Table",
    });
  } catch (error) {
    console.log("Error inserting record in tasks table", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
