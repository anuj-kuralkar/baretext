DEFINE TABLE note SCHEMAFULL
  PERMISSIONS
    FOR select, update, delete
      WHERE array::flatten(SELECT VALUE <-owns<-user FROM note) CONTAINS $auth.id

DEFINE FIELD content ON TABLE note TYPE object FLEXIBLE DEFAULT {
  root: {
    children: [
      {
        children: [],
        direction: NONE,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1
      }
    ],
    direction: NONE,
    format: "",
    indent: 0,
    type: "root",
    version: 1
  }
};
DEFINE FIELD createdAt ON TABLE note TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updatedAt ON TABLE note TYPE datetime VALUE time::now();

DEFINE INDEX note_createdAt ON TABLE note FIELDS createdAt;
DEFINE INDEX note_updatedAt ON TABLE note FIELDS updatedAt;
