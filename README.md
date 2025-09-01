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

# 5. Follow the feed
npm run start follow 1

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
| `follow <id>` | Follow a feed by its ID (requires login) |
| `following`   | List feeds you are following (requires login) |
| `unfollow <id>` | Unfollow a feed (requires login) |
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

#### `login`
Log in to an existing user account.

```bash
npm run start login
```

---

#### `register`
Create a new user account.

```bash
npm run start register
```

---

#### `reset`
Reset the database (dangerous — wipes users, feeds, and follows).

```bash
npm run start reset
```

---

#### `users`
List all registered users.

```bash
npm run start users
```

---

### Feed Aggregation

#### `agg`
Aggregate (fetch) all feeds and update the local database with the latest posts.

```bash
npm run start agg
```

---

#### `feeds`
List all available feeds in the system.

```bash
npm run start feeds
```

---

### Feed & Follow Management (requires login)

#### `addfeed`
Add a new RSS/Atom feed to the system.

```bash
npm run start addfeed <url>
```

---

#### `follow`
Follow a feed so that its posts show up in your personal browse view.

```bash
npm run start follow <feed_id>
```

---

#### `following`
List the feeds you are currently following.

```bash
npm run start following
```

---

#### `unfollow`
Unfollow a feed.

```bash
npm run start unfollow <feed_id>
```

---

#### `browse`
Browse posts from the feeds you follow.

```bash
npm run start browse
```

---

## ⚠️ Notes
- Commands like `addfeed`, `follow`, `unfollow`, `following`, and `browse` **require you to be logged in**.  
- The `reset` command will clear **all users and feeds** — use with caution.  
