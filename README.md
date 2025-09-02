# 📖 Blog Aggregator CLI

A command-line interface (CLI) tool to register, manage feeds, and browse aggregated blog posts.  
This project was built as part of a [Boot.dev](https://boot.dev) guided course.  

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Register a new account
npm run start register

# 3. Log in
npm run start login

# 4. Add a feed
npm run start addfeed https://example.com/rss

# 6. Aggregate posts
npm run start agg

# 7. Browse your feed
npm run start browse
```

✅ In less than a minute you can start reading blog posts directly from the CLI!  

---

## 📋 Command Cheatsheet

| Command       | Description |
|---------------|-------------|
| `login`       | Log in to an existing user account |
| `register`    | Create a new user account |
| `reset`       | Reset the database (⚠ wipes all users, feeds, and follows) |
| `users`       | List all registered users |
| `agg`         | Fetch and update all feeds with the latest posts |
| `feeds`       | List all available feeds in the system |
| `addfeed <url>` | Add a new RSS/Atom feed (requires login) |
| `follow <url>` | Follow a feed by its ID (requires login) |
| `following`   | List feeds you are following (requires login) |
| `unfollow <url>` | Unfollow a feed (requires login) |
| `browse`      | Browse posts from your followed feeds (requires login) |

---

## 🚀 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/blog-aggregator.git
cd blog-aggregator
npm install
```

Run the CLI with:

```bash
npm run start <command> [options]
```

---

## 🧑‍💻 Commands (Detailed)

### Authentication & User Management

<details>
<summary><code>login</code> – Log in to an existing user account</summary>

```bash
npm run start login
```
</details>

---

<details>
<summary><code>register</code> – Create a new user account</summary>

```bash
npm run start register
```
</details>

---

<details>
<summary><code>reset</code> – Reset the database (⚠ wipes users, feeds, and follows)</summary>

```bash
npm run start reset
```
</details>

---

<details>
<summary><code>users</code> – List all registered users</summary>

```bash
npm run start users
```
</details>

---

### Feed Aggregation

<details>
<summary><code>agg</code> – Fetch and update all feeds with the latest posts</summary>

```bash
npm run start agg
```
</details>

---

<details>
<summary><code>feeds</code> – List all available feeds in the system</summary>

```bash
npm run start feeds
```
</details>

---

### Feed & Follow Management (requires login)

<details>
<summary><code>addfeed &lt;url&gt;</code> – Add a new RSS/Atom feed</summary>

```bash
npm run start addfeed <url>
```
</details>

---

<details>
<summary><code>follow &lt;feed_id&gt;</code> – Follow a feed by its ID</summary>

```bash
npm run start follow <url>
```
</details>

---

<details>
<summary><code>following</code> – List feeds you are currently following</summary>

```bash
npm run start following
```
</details>

---

<details>
<summary><code>unfollow &lt;feed_id&gt;</code> – Unfollow a feed</summary>

```bash
npm run start unfollow <url>
```
</details>

---

<details>
<summary><code>browse</code> – Browse posts from your followed feeds</summary>

```bash
npm run start browse
```
</details>

---

## ⚠️ Notes
- Commands like `addfeed`, `follow`, `unfollow`, `following`, and `browse` **require you to be logged in**.  
- The `reset` command will clear **all users and feeds** — use with caution.

## Future Improvements
-Add bookmarking or liking posts
-Add a search command that allows for fuzzy searching of posts
-Add an HTTP API (and authentication/authorization) that allows other users to interact with the service remotely
-Add a TUI that allows you to select a post in the terminal and view it in a more readable format (either in the terminal or open in a browser)

