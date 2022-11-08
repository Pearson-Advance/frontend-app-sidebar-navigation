frontend-app-sidebar-navigation
===============================

Introduction
------------

This is the Sidebar Navigation MFE (Micro-Frontend Application), which allows interaction with the course outline directly on the course content pages
`Frontend app Sidebar Navigation MFE <https://github.com/Pearson-Advance/frontend-app-sidebar-navigation>`_.

This is useful if you have large courses or want to improve the user experience, as the learner does not need to leave the course content page to navigate
to other sections or subsections of your course.

**Prerequisites**

- Install devstack locally and then run ``make dev.up``.
- It is necessary to be logged in to be able to enter the MFE.

**Installation and Startup**

1. Clone the repo using SSH:

  ``git clone git@github.com:Pearson-Advance/frontend-app-sidebar-navigation.git``

2. Use node v16.x.

   The micro-frontend build scripts support node 16.  Using other major versions of node *may* work, but is unsupported.  For convenience, this repository includes an .nvmrc file to help in setting the correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

3. Install npm dependencies:

  ``cd frontend-app-sidebar-navigation && npm install``

4. Verify the application port to use for local development ``:9090``.

5. Start the dev server:

  ``npm start``

The dev server is running at ``http://localhost:9090`` or whatever port you setup.

Project Structure
-----------------

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/openedx/frontend-template-application/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Build Process Notes
-------------------

**Production Build**

The production build is created with ``npm run build``.
