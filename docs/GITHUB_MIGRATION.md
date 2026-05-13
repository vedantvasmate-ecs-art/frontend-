# GitHub Account Migration Guide: Changing Repository Ownership

## 1. Problem Statement
The free trial on the original GitHub account or associated platform ended. The goal was to migrate the existing `company_ethara_frontend` local codebase to a completely different GitHub account (`vedantvasmate-ecs-art`) and a new repository (`frontend-.git`).

During the initial attempt to push the code to the new account, the following error occurred:
```text
remote: Permission to vedantvasmate-ecs-art/frontend-.git denied to armaan-github.
fatal: unable to access 'https://github.com/vedantvasmate-ecs-art/frontend-.git/': The requested URL returned error: 403
```
**Cause:** The error happened because Windows Git Credential Manager had securely cached the credentials of the *previous* GitHub account (`armaan-github`). Even though the remote URL was changed, Git was silently using the old account token to authenticate, leading to a `403 Forbidden` error because the old account didn't have access to the new repository.

---

## 2. Solution & Steps Taken

To fix this, we needed to disconnect the local project from the old repository, clear the cached Git credentials from Windows, and finally push the files to the new GitHub location.

### Step 1: Update the Remote URL
First, we told Git to forget the old repository URL and point to the new one.
```powershell
# Remove the old remote pointing to the previous GitHub account
git remote remove origin

# Add the new remote pointing to the new GitHub account
git remote add origin https://github.com/vedantvasmate-ecs-art/frontend-.git

# Ensure the default branch is named 'main'
git branch -M main
```

### Step 2: Clear Old Git Credentials
To force Git to ask for a new login, we cleared the existing cached credentials for `github.com` from the Windows Git Credential Manager.
```powershell
# Reject (clear) the saved credentials for github.com
echo "protocol=https`nhost=github.com" | git credential reject
```
*(Alternatively, this can be done manually by opening "Credential Manager" in Windows -> "Windows Credentials" -> Deleting the `git:https://github.com` entry).*

### Step 3: Push and Authenticate
With the remote updated and old accounts cleared, we triggered a fresh code push.
```powershell
# Push the code and set the upstream branch
git push -u origin main
```
Because the old credentials were deleted, Git triggered the Git Credential Manager UI (a browser popup) asking to sign in. The user signed in using the **new** account (`vedantvasmate-ecs-art`), generating a new secure token.

### Step 4: Verification
The push completed successfully:
```text
Writing objects: 100% (163/163), 794.01 KiB | 12.03 MiB/s, done.
Total 163 (delta 49), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (49/49), done.
To https://github.com/vedantvasmate-ecs-art/frontend-.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```
The codebase is now fully detached from the old account and safely hosted on the new GitHub account.
