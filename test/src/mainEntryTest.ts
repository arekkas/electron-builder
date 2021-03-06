import BluebirdPromise from "bluebird-lst"
import { move } from "fs-extra-p"
import * as path from "path"
import { allPlatforms, appTwoThrows, assertPack, modifyPackageJson } from "./helpers/packTester"

test("invalid main in the app package.json", appTwoThrows(allPlatforms(false), {
  projectDirCreated: projectDir => modifyPackageJson(projectDir, data => {
    data.main = "main.js"
  }, true)
}))

test("invalid main in the app package.json (no asar)", appTwoThrows(allPlatforms(false), {
  projectDirCreated: projectDir => {
    return BluebirdPromise.all([
      modifyPackageJson(projectDir, data => {
        data.main = "main.js"
      }, true),
      modifyPackageJson(projectDir, data => {
        data.build.asar = false
      })
    ])
  }
}))

test("invalid main in the app package.json (custom asar)", appTwoThrows(allPlatforms(false), {
  projectDirCreated: projectDir => {
    return BluebirdPromise.all([
      modifyPackageJson(projectDir, data => {
        data.main = "path/app.asar/main.js"
      }, true),
      modifyPackageJson(projectDir, data => {
        data.build.asar = false
      })
    ])
  }
}))

test("main in the app package.json (no asar)", () => assertPack("test-app", allPlatforms(false), {
  projectDirCreated: projectDir => {
    return BluebirdPromise.all([
      move(path.join(projectDir, "app", "index.js"), path.join(projectDir, "app", "main.js")),
      modifyPackageJson(projectDir, data => {
        data.main = "main.js"
      }, true),
      modifyPackageJson(projectDir, data => {
        data.build.asar = false
      })
    ])
  }
}))

test("main in the app package.json (custom asar)", () => assertPack("test-app", allPlatforms(false), {
  projectDirCreated: projectDir => {
    return BluebirdPromise.all([
      modifyPackageJson(projectDir, data => {
        data.main = "path/app.asar/index.js"
      }, true),
      modifyPackageJson(projectDir, data => {
        data.build.asar = false
      })
    ])
  }
}))