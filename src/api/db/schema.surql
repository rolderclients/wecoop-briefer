DEFINE NAMESPACE IF NOT EXISTS dev;
DEFINE DATABASE IF NOT EXISTS data STRICT;

// Tables

// Category
DEFINE TABLE OVERWRITE category TYPE NORMAL SCHEMAFULL PERMISSIONS
	FOR select, create, update, delete WHERE $auth.role IN ['admin'];
DEFINE FIELD OVERWRITE title ON category TYPE string;
DEFINE FIELD OVERWRITE services ON category COMPUTED <~service;
DEFINE FIELD OVERWRITE time ON category TYPE object DEFAULT { created: datetime, updated: datetime };
DEFINE FIELD OVERWRITE time.created ON category TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD OVERWRITE time.updated ON category TYPE datetime VALUE time::now();

// Service
-- DEFINE TABLE OVERWRITE service TYPE NORMAL SCHEMAFULL;
-- DEFINE FIELD OVERWRITE title ON service TYPE string;
-- DEFINE FIELD OVERWRITE archived ON service TYPE bool DEFAULT false;
-- DEFINE FIELD OVERWRITE category ON service TYPE record<category> REFERENCE ON DELETE IGNORE;
-- DEFINE FIELD OVERWRITE prompts ON service COMPUTED <~prompt;
-- DEFINE FIELD OVERWRITE tasks ON service COMPUTED <~task;
-- DEFINE FIELD OVERWRITE time ON service TYPE object DEFAULT {  };
-- DEFINE FIELD OVERWRITE time.created ON service TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD OVERWRITE time.updated ON service TYPE datetime VALUE time::now();

// Model
-- DEFINE TABLE OVERWRITE model TYPE NORMAL SCHEMAFULL;
-- DEFINE FIELD OVERWRITE title ON model TYPE string;
-- DEFINE FIELD OVERWRITE name ON model TYPE string;
-- DEFINE FIELD OVERWRITE prompts ON model COMPUTED <~prompt;
-- DEFINE FIELD OVERWRITE time ON model TYPE object DEFAULT {  };
-- DEFINE FIELD OVERWRITE time.created ON model TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD OVERWRITE time.updated ON model TYPE datetime VALUE time::now();

-- // Prompt
-- DEFINE TABLE OVERWRITE prompt TYPE NORMAL SCHEMAFULL;
-- DEFINE FIELD OVERWRITE title ON prompt TYPE string;
-- DEFINE FIELD OVERWRITE content ON prompt TYPE none | string;
-- DEFINE FIELD OVERWRITE enabled ON prompt TYPE bool DEFAULT false;
-- DEFINE FIELD OVERWRITE archived ON prompt TYPE bool DEFAULT false;
-- DEFINE FIELD OVERWRITE service ON prompt TYPE record<service> REFERENCE ON DELETE IGNORE;
-- DEFINE FIELD OVERWRITE model ON prompt TYPE record<model> REFERENCE ON DELETE IGNORE;
-- DEFINE FIELD OVERWRITE time ON prompt TYPE object DEFAULT {  };
-- DEFINE FIELD OVERWRITE time.created ON prompt TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD OVERWRITE time.updated ON prompt TYPE datetime VALUE time::now();

-- // Task
-- DEFINE TABLE OVERWRITE task TYPE NORMAL SCHEMAFULL;
-- DEFINE FIELD OVERWRITE title ON task TYPE string;
-- DEFINE FIELD OVERWRITE content ON task TYPE none | string;
-- DEFINE FIELD OVERWRITE company ON task TYPE object DEFAULT {  };
-- DEFINE FIELD OVERWRITE company.title ON task TYPE none | string;
-- DEFINE FIELD OVERWRITE company.info ON task TYPE none | string;
-- DEFINE FIELD OVERWRITE archived ON task TYPE bool DEFAULT false;
-- DEFINE FIELD OVERWRITE service ON task TYPE record<service> REFERENCE ON DELETE IGNORE;
-- DEFINE FIELD OVERWRITE brief ON task TYPE none | record<brief>;
-- DEFINE FIELD OVERWRITE time ON task TYPE object DEFAULT {  };
-- DEFINE FIELD OVERWRITE time.created ON task TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD OVERWRITE time.updated ON task TYPE datetime VALUE time::now();

-- // Brief
-- DEFINE TABLE OVERWRITE brief TYPE NORMAL SCHEMAFULL;
-- DEFINE FIELD OVERWRITE content ON brief TYPE none | string;
-- DEFINE FIELD OVERWRITE time ON brief TYPE object DEFAULT {  };
-- DEFINE FIELD OVERWRITE time.created ON brief TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD OVERWRITE time.updated ON brief TYPE datetime VALUE time::now();

// Better Auth
// User
DEFINE TABLE OVERWRITE user TYPE NORMAL SCHEMAFULL PERMISSIONS
	FOR create WHERE $auth.role == 'admin'
	FOR select, update, delete WHERE id = $auth.id OR $auth.role == 'admin';
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
DEFINE FIELD OVERWRITE banReason ON user TYPE option<string>;
DEFINE FIELD OVERWRITE banExpires ON user TYPE option<datetime>;
// Username plugin
DEFINE FIELD OVERWRITE username ON user TYPE string;
DEFINE FIELD OVERWRITE displayUsername ON user TYPE string;
// Custom
DEFINE FIELD OVERWRITE accounts ON user COMPUTED <~account;

-- // Session
DEFINE TABLE OVERWRITE session TYPE NORMAL SCHEMAFULL PERMISSIONS
	FOR select, create, update, delete WHERE $auth.role IN ['admin'];
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
DEFINE TABLE OVERWRITE account TYPE NORMAL SCHEMAFULL PERMISSIONS
	FOR select, create, update, delete WHERE $auth.role IN ['admin'];
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
DEFINE TABLE OVERWRITE verification TYPE NORMAL SCHEMAFULL PERMISSIONS
	FOR select, create, update, delete WHERE $auth.role IN ['admin'];
DEFINE FIELD OVERWRITE identifier ON verification TYPE string;
DEFINE FIELD OVERWRITE value ON verification TYPE string;
DEFINE FIELD OVERWRITE expiresAt ON verification TYPE datetime;
DEFINE FIELD OVERWRITE createdAt ON verification TYPE option<datetime>;
DEFINE FIELD OVERWRITE updatedAt ON verification TYPE option<datetime>;

// Access
DEFINE ACCESS OVERWRITE user ON DATABASE TYPE RECORD
	SIGNIN {
        LET $user = SELECT *, accounts[WHERE providerId == 'credential'][0].password AS password
            FROM ONLY user WHERE username = $username;
        IF !$user { THROW 'INVALID_CREDENTIALS' };
        LET $hash = $user.password;
        IF !crypto::argon2::compare($hash, $password) { THROW 'INVALID_CREDENTIALS' }
        ELSE { RETURN [$user] }
    };
