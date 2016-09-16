# .NET Core and TypeScript - Continuous Delivery to Azure

This is a small example showing how to make continuous delivery of a web application with TypeScript and a client-side build pipeline to an Azure web app/site work smoothly. The example is built starting off with an emtpy **.NET Core Web Application** from the template in Visual Studio 2015 (.NET 4.6.2). On top of that there will be a "Hello World"-saying **TypeScript** application. The .NET Core Web Application can be used later as a backend service, e.g. Web Api, if needed. The whole solution will be continuously delivered/deployed to an **Azure Web App** using **Kudu** and **Gulp**.

**Please note that this Readme is committed after all other commits.** Open this file in a separate browser tab or window before browsing the code referenced in the text below.

## Prerequisites

To fully implement this solution the following things are needed:
- An **Azure subscription** for the Azure Web App (free version is sufficient)
- **A GitHub account/repo** to be used for deployment to Azure
- **Visual Studio 2015, Community edition or higher**
- (.NET 4.6.2)
- **NodeJs version 6.5.0** or later and **npm version 3.10.3** or later
- **Azure-CLI** installed on the dev machine

## Initial setup

Start off by creating an Azure Web App and change the **'WEBSITE_NODE_DEFAULT_VERSION'** application setting to be at least **6.5.0**. This will have effect on the NodeJs and npm versions used by kudu in the deployment script.

Create a GitHub repo and connect it for deployment to the Azure Web App in the Azure Portal - Deployment Options.

Make sure to have a **.gitignore** file suitable for the solution. The one in this repo works for this demo.

##1. Create and tweak the Visual Studio Solution

This step is really easy, just hit **File - New - Project** and select the **ASP.NET Core Web Application template**. Select the **Empty template**, verify that "No Auhtentication" is active and deselect "Host in the cloud". Hit [OK] and the project is created.

Hit F5 to see the web application in action. It should say "Hello World!" in plain text.

Now it is time to add a static html-file, index.html, to the wwwroot folder.

Modify the Startup.cs to serve the html file instead of the plain text response. Hit F5 to verify that the newly created html file is served in the browser ([code so far](https://github.com/Fjeddo/NET-Core-TypeScript-Continuous-Delivery-To-Azure/tree/cb0d295ae49570ec0c0bf642b79d2819a0571323)).

##2. Initial setup for continuous delivery using kudu

The deployment script for kudu is downloaded using the Azure-CLI:
>azure site deploymentscript --aspNetCore NetCoreWebApplication\project.json

If the command fails it is most likely because the Azure-CLI is in the wrong mode. Change mode using:
> azure config mode asm

Now when committing and pushing to the GitHub remote repo the web application should be deployed to the Azure Web App ([code so far](https://github.com/Fjeddo/NET-Core-TypeScript-Continuous-Delivery-To-Azure/tree/086310cf83e35fea95cb9faed4e73adf6793e3f6)).

##3. Add TypeScript and make it transpile using gulp

In the web application project root folder, add a new **scripts** folder. This folder will contain the TypeScript files for the application. In the scripts folder, add a new TypeScript file with the name **hello.ts**. This will be transpiled into a .js file to be referenced from the index.html file. The transpilation is done using gulp.

**gulp** is a task runner used in this demo to implement a client-side build pipeline. First initialize npm using in the project root folder, e.g. where the project.json file is located:
>npm init

This will create a package.json file for the client-side Node packages.

Add the gulp and gulp-typescript package:
>npm install gulp --save-dev

>npm install gulp-typescript --save-dev

In Visual Studio, right-click the web application project and do **Add - New Item... - Client-side - Gulp Configuration File**, keep the default filename **gulpfile.js**. The gulp config file contains a default task where the TypeScript transpilation is performed and the output is placed in a **dist** folder. The dist folder is ignored in the version control since it is generated, but is later synced by kudu to the wwwroot folder. The .js file from the transpilation is referenced in the index.html file ([code so far](https://github.com/Fjeddo/NET-Core-TypeScript-Continuous-Delivery-To-Azure/tree/a13a8bafd53d310e2b45fb16d171506f8a1ff25d)).

**Please note that the reference to the .js file in index.html is marked as not valid since the .js file is in the dist folder and not the wwwroot folder.** This will make the solution to **not work properly** when debugging or running it locally. There are a bunch of solutions to this, where I prefer to create a gulp task to sync the dist folder to the wwwroot folder. The generated .js files, and all other generate files, in the wwwroot folder has to be exclude in the version control via the .gitignore file. 

##4. Make the deployment script run the gulp tasks and sync the dist folder

By default the deployment script does not contain any client-side stuff and therefore the TypeScript transpilation gulp task is not run. There are a couple of things need to be added in the **deploy.cmd** file, downloaded earlier using the Azure-CLI. The Node packages have to be restored and the gulp tasks have to be run. Committing and pushing to the GitHub remote repo will trigger a new deployment to the Azure Web App ([code so far](https://github.com/Fjeddo/NET-Core-TypeScript-Continuous-Delivery-To-Azure/tree/b2605ad13086bedf4ad65cf29dc58a6a33013c2c)). 

Browsing to the Azure Web App, http://netcore-typescript.azurewebsites.net in this example, with a developer console open should now display the log **"Hello from TypeScript!"**. 

##Done!
I really hope that this little example will be useful when setting up Continuous Delivery/Deployment to Azure using a git repo. The web application is deployed here http://netcore-typescript.azurewebsites.net.
