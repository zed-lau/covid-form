## Assumptions
1) Developer has Postgres environment set up in local machine
2) Data (questions) are manually inserted into database though ideally, we should use seeding or have a POST API to create these data
3) Database migration scripts are not required
4) Environment variables are configured correctly
5) Instead of limiting to a static number of questions, app is open to scaling (more questions && questionnaires) to be 'production-ready'
6) Duplicate copies of the same submission responses are allowed as auth & identity are undefined
7) All fields in form are mandatory
8) Responsive web design is not required on web app
