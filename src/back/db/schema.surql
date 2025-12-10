DEFINE NAMESPACE IF NOT EXISTS dev;
DEFINE DATABASE IF NOT EXISTS data STRICT;

// Tables
DEFINE FUNCTION OVERWRITE fn::tableNames() { object::keys((INFO FOR DATABASE).tables) } PERMISSIONS FULL;

// Category
DEFINE TABLE OVERWRITE category TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON category TYPE string;
DEFINE FIELD OVERWRITE services ON category COMPUTED <~service;
DEFINE FIELD OVERWRITE time ON category TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON category TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON category TYPE datetime VALUE time::now();

// Service
DEFINE TABLE OVERWRITE service TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON service TYPE string;
DEFINE FIELD OVERWRITE archived ON service TYPE bool DEFAULT false;
DEFINE FIELD OVERWRITE category ON service TYPE record<category> REFERENCE ON DELETE IGNORE;
DEFINE FIELD OVERWRITE prompts ON service COMPUTED <~prompt;
DEFINE FIELD OVERWRITE tasks ON service COMPUTED <~task;
DEFINE FIELD OVERWRITE time ON service TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON service TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON service TYPE datetime VALUE time::now();

// Model
DEFINE TABLE OVERWRITE model TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON model TYPE string;
DEFINE FIELD OVERWRITE name ON model TYPE string;
DEFINE FIELD OVERWRITE prompts ON model COMPUTED <~prompt;
DEFINE FIELD OVERWRITE time ON model TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON model TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON model TYPE datetime VALUE time::now();

// Prompt
DEFINE TABLE OVERWRITE prompt TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON prompt TYPE string;
DEFINE FIELD OVERWRITE content ON prompt TYPE option<string>;
DEFINE FIELD OVERWRITE enabled ON prompt TYPE bool DEFAULT false;
DEFINE FIELD OVERWRITE archived ON prompt TYPE bool DEFAULT false;
DEFINE FIELD OVERWRITE service ON prompt TYPE record<service> REFERENCE ON DELETE IGNORE;
DEFINE FIELD OVERWRITE model ON prompt TYPE record<model> REFERENCE ON DELETE IGNORE;
DEFINE FIELD OVERWRITE time ON prompt TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON prompt TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON prompt TYPE datetime VALUE time::now();

// Task
DEFINE TABLE OVERWRITE task TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON task TYPE string;
DEFINE FIELD OVERWRITE content ON task TYPE option<string>;
DEFINE FIELD OVERWRITE company ON task TYPE option<object>;
DEFINE FIELD OVERWRITE company.title ON task TYPE option<string>;
DEFINE FIELD OVERWRITE company.info ON task TYPE option<string>;
DEFINE FIELD OVERWRITE archived ON task TYPE bool DEFAULT false;
DEFINE FIELD OVERWRITE files ON task COMPUTED <~file;
DEFINE FIELD OVERWRITE service ON task TYPE record<service> REFERENCE ON DELETE IGNORE;
DEFINE FIELD OVERWRITE brief ON task TYPE record<brief> DEFAULT (CREATE ONLY brief).id;
DEFINE FIELD OVERWRITE chat ON task TYPE record<chat> DEFAULT (CREATE ONLY chat).id;
DEFINE FIELD OVERWRITE time ON task TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON task TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON task TYPE datetime VALUE time::now();

// Comment for task
DEFINE TABLE OVERWRITE comment TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE value ON comment TYPE string;
DEFINE FIELD OVERWRITE task ON comment TYPE record<task> REFERENCE ON DELETE IGNORE;
DEFINE FIELD OVERWRITE time ON comment TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON comment TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON comment TYPE datetime VALUE time::now();

// Delete brief and files on task deletion
DEFINE EVENT OVERWRITE task_deleted ON task WHEN $event = 'DELETE' THEN {
    DELETE $before.brief.id;
    DELETE file WHERE id IN $before.files.id;
};

// File
DEFINE TABLE OVERWRITE file TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE s3Key ON file TYPE string;
DEFINE FIELD OVERWRITE originalName ON file TYPE string;
DEFINE FIELD OVERWRITE type ON file TYPE string;
DEFINE FIELD OVERWRITE size ON file TYPE number;
DEFINE FIELD OVERWRITE task ON file TYPE record<task> REFERENCE ON DELETE IGNORE;
DEFINE FIELD OVERWRITE time ON file TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON file TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON file TYPE datetime VALUE time::now();

// Brief
DEFINE TABLE OVERWRITE brief TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE content ON brief TYPE option<string>;
DEFINE FIELD OVERWRITE time ON brief TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON brief TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON brief TYPE datetime VALUE time::now();

// Chat
DEFINE TABLE OVERWRITE chat TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE messages ON chat TYPE array<object> DEFAULT [];
DEFINE FIELD OVERWRITE messages.* ON chat TYPE object FLEXIBLE;
DEFINE FIELD OVERWRITE time ON chat TYPE object DEFAULT { };
DEFINE FIELD OVERWRITE time.created ON chat TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON chat TYPE datetime VALUE time::now();

// Data
LET $models = [
    { id: model:claudeHaiku_4_5, name: 'anthropic/claude-haiku-4.5', title: 'Anthropic Claude Haiku 4.5' },
    { id: model:claudeSonnet_4_5, name: 'anthropic/claude-sonnet-4.5', title: 'Anthropic Claude Sonnet 4.5' },
    { id: model:geminiFlash_2_5, name: 'google/gemini-2.5-flash', title: 'Google Gemini 2.5 Flash' },
    { id: model:geminiPro_2_5, name: 'google/gemini-2.5-pro', title: 'Google Gemini 2.5 Pro' }
];
DELETE model;
FOR $model IN $models { CREATE $model.id CONTENT $model };

// Better Auth
// User
DEFINE TABLE OVERWRITE user TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE name ON user TYPE string;
DEFINE FIELD OVERWRITE email ON user TYPE string ASSERT string::is_email($value);
DEFINE INDEX OVERWRITE userUserUnique ON user COLUMNS email UNIQUE;
DEFINE FIELD OVERWRITE emailVerified ON user TYPE bool;
DEFINE FIELD OVERWRITE image ON user TYPE option<string>;
DEFINE FIELD OVERWRITE createdAt ON user TYPE datetime;
DEFINE FIELD OVERWRITE updatedAt ON user TYPE datetime;
// Admin plugin
DEFINE FIELD OVERWRITE role ON user TYPE option<string>;
DEFINE FIELD OVERWRITE banned ON user TYPE option<bool>;
DEFINE FIELD OVERWRITE banReason ON user TYPE option<string> | NULL;
DEFINE FIELD OVERWRITE banExpires ON user TYPE option<datetime> | NULL;
// Username plugin
DEFINE FIELD OVERWRITE username ON user TYPE string;
DEFINE FIELD OVERWRITE displayUsername ON user TYPE string;
// Custom
DEFINE FIELD OVERWRITE accounts ON user COMPUTED <~account;

-- // Session
DEFINE TABLE OVERWRITE session TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE expiresAt ON session TYPE datetime;
DEFINE FIELD OVERWRITE token ON session TYPE string;
DEFINE INDEX OVERWRITE sessionSessionUnique ON session COLUMNS token UNIQUE;
DEFINE FIELD OVERWRITE createdAt ON session TYPE datetime;
DEFINE FIELD OVERWRITE updatedAt ON session TYPE datetime;
DEFINE FIELD OVERWRITE ipAddress ON session TYPE option<string>;
DEFINE FIELD OVERWRITE userAgent ON session TYPE option<string>;
DEFINE FIELD OVERWRITE userId ON session TYPE record<user>;
// Admin plugin
DEFINE FIELD OVERWRITE impersonatedBy ON user TYPE option<record<user>>;

-- // Account
DEFINE TABLE OVERWRITE account TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE accountId ON account TYPE string;
DEFINE FIELD OVERWRITE providerId ON account TYPE string;
DEFINE FIELD OVERWRITE accessToken ON account TYPE option<string>;
DEFINE FIELD OVERWRITE refreshToken ON account TYPE option<string>;
DEFINE FIELD OVERWRITE idToken ON account TYPE option<string>;
DEFINE FIELD OVERWRITE accessTokenExpiresAt ON account TYPE option<datetime>;
DEFINE FIELD OVERWRITE refreshTokenExpiresAt ON account TYPE option<datetime>;
DEFINE FIELD OVERWRITE scope ON account TYPE option<string>;
DEFINE FIELD OVERWRITE password ON account TYPE option<string>;
DEFINE FIELD OVERWRITE createdAt ON account TYPE datetime;
DEFINE FIELD OVERWRITE updatedAt ON account TYPE datetime;
// Custom
-- DEFINE FIELD OVERWRITE userId ON account TYPE record<user>;
DEFINE FIELD OVERWRITE userId ON account TYPE record<user> REFERENCE ON DELETE IGNORE;

// Verification
DEFINE TABLE OVERWRITE verification TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD OVERWRITE identifier ON verification TYPE string;
DEFINE FIELD OVERWRITE value ON verification TYPE string;
DEFINE FIELD OVERWRITE expiresAt ON verification TYPE datetime;
DEFINE FIELD OVERWRITE createdAt ON verification TYPE option<datetime>;
DEFINE FIELD OVERWRITE updatedAt ON verification TYPE option<datetime>;

// Root auth user
UPSERT user:root CONTENT {
    name: 'Системная учетная запись',
    role: 'admin',
    username: 'root'   ,
    displayUsername: 'Root',
    email: 'mail@rolder.dev',
    emailVerified: false,
    banned: false,
    createdAt: d'2025-11-22T23:18:28.472Z',
    updatedAt: d'2025-11-22T23:18:28.472Z'
};
UPSERT account:root CONTENT {
    accountId: 'root',
    userId: user:root,
    password: '52c2da6bc1a525ee0f6a298e228a1314:c7ba714b9467d4582c5848947c2536340ff9f85ff6ca6c9ee022f68cd5eb60e227ba0cbadd3d46e9316c4562cef9d7551c957192809bf2a4b27f2a2b1365a08e',
    providerId: 'credential',
    createdAt: d'2025-11-22T23:18:29.159Z',
    updatedAt: d'2025-11-22T23:18:29.159Z'
};
// Default admin user
UPSERT user:admin CONTENT {
    name: 'Админ',
    role: 'admin',
    username: 'admin'   ,
    displayUsername: 'Admin',
    email: 'admin@rolder.dev',
    emailVerified: false,
    banned: false,
    createdAt: d'2025-11-22T23:18:28.472Z',
    updatedAt: d'2025-11-22T23:18:28.472Z'
};
UPSERT account:admin CONTENT {
    accountId: 'admin',
    userId: user:admin,
    password: '287fc2bb039230d321aad784d422fa95:8943b639ffe0f0c787a6de67497100a4103582b2c4b34efa14b1118d2a5e6cf43ebf6e239da88a36b1e8a0c9dd45756d227e20db22ff2213c0984713fd70e0fd',
    providerId: 'credential',
    createdAt: d'2025-11-22T23:18:29.159Z',
    updatedAt: d'2025-11-22T23:18:29.159Z'
};
