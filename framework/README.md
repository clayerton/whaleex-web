# datayes-card(dyc) 使用教程

## 添加 dyc 作为 subtree

具体添加过程可以参考 https://www.atlassian.com/blog/git/alternatives-to-git-submodule-git-subtree

1. 添加dyc remote repository

```
git remote add -f ${remote_repo_name} git@git.datayes.com:Achilles/datayes-cards.git

实例：
git remote add -f dyc git@git.datayes.com:Achilles/datayes-cards.git
```

2. 添加subtree


```
git subtree add --prefix ${local_dyc_folder} ${remote_repo_name} ${remote_repo_branch} --squash

实例：
git subtree add --prefix framework dyc framework --squash
```

3. 更新sub-project

```
git fetch ${remote_repo_name} ${remote_repo_branch}
git subtree pull --prefix ${local_dyc_folder} ${remote_repo_name} ${remote_repo_branch} --squash

实例：
git fetch dyc framework
git subtree pull --prefix framework dyc framework --squash
```

**如需同时维护framework,可以参考以下链接**

https://git-scm.com/book/en/v1/Git-Tools-Subtree-Merging

http://www.congruityservice.com/blog/fix-git-subtree-merge-wrong-directory-cannot-bind

## 当前项目使用 dyc
1. 在根目录添加 src 文件夹

2. 在根目录添加 package.app.json ，并更改内容

```javascript
{
  "config": {
    "framework": "framework",   // dyc folder
    "appName": "rrp",   // app name
    "appDir": "src",    // app code folder
    "appLoadable": "src/containers/App/Loadable"    // app loadable file path
  }
}
```

3. 生成 package.json

```
node ./${local_dyc_folder}/scripts/generate.js

实例：
node ./framework/scripts/generate.js
```

4. 安装依赖 npm i，之后就可以使用npm script 脚本
