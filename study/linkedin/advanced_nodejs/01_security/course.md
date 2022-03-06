## OWASP Security links

### https://nodegoat.herokuapp.com/tutorial

---

## XSS

### https://www.google.com/about/appsecurity/learning/xss

---

## Dependency Check

### https://owasp.org/www-project-dependency-check/

```bash
<path/to/bin>./dependency-check.sh --project "whatever" --scan "/home/gusw/code/javascript_main/study/linkedin/advanced_nodejs/01_security/base"
```

---

### Run mongodb (Docker)

```bash
docker run --name mongo-base -p 27017:27017 mongo:5.0
```

### NPM Packages maintenance

```bash
npm audit
npm outdated
npm install <updatedPackageName> [-D]
npm uninstall <packageName> [-D]

```
