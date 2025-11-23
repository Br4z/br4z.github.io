/**
 * Blog Pagination Module
 * Handles pagination for both the main blog list and search results.
 * Listens for "blogContentUpdated" events to refresh when content changes.
 */
addEventListener("DOMContentLoaded", () => {
	// DOM elements
	const blog_list_html = document.querySelector(".blog-list")

	let blog_list
	const prev_btn = document.querySelector(".blog-pagination .pagination-btn:first-child")
	const next_btn = document.querySelector(".blog-pagination .pagination-btn:last-child")
	const page_numbers_container = document.querySelector(".page-numbers")

	// Pagination state
	let posts
	const post_per_page = 5
	let total_pages

	let current_page = 1

	/**
	 * Updates pagination variables based on the active container
	 * Detects whether to paginate the main blog list or search results
	 */
	const update_variables = () => {
		let parent_container

		// Check which container is visible and update accordingly
		if (blog_list_html.style.display == "none") {
			parent_container = "#search-results"
			blog_list = document.getElementById("search-results")
		} else {
			parent_container = ".blog-list"
			blog_list = blog_list_html
		}

		posts = Array.from(document.querySelectorAll(`${parent_container} .blog-item`))
		total_pages = Math.ceil(posts.length / post_per_page)
	}

	/**
	 * Renders a specific page of blog posts
	 * @param {number} page - The page number to render (1-indexed)
	 */
	const render_page = (page) => {
		// Ensure page is within valid range
		if (page < 1)
			page = 1
		else if (page > total_pages)
			page = total_pages

		current_page = page

		// Hide all posts
		posts.forEach(post => post.style.display = "none")

		// Show posts for the current page
		const start_index = (page - 1) * post_per_page
		const end_index = start_index + post_per_page
		posts.slice(start_index, end_index).forEach(post => post.style.display = "")

		// Update button states
		prev_btn.disabled = current_page === 1
		next_btn.disabled = current_page === total_pages

		// Update active page number
		document.querySelectorAll(".page-number").forEach((btn, index) => {
			btn.classList.toggle("active", index + 1 === current_page)
		})

		// Scroll to top ob the blog list
		blog_list.scrollIntoView({ behavior: "smooth", block: "start" })
	}

	/**
	 * Initializes pagination controls by creating page number buttons
	 * Clears existing buttons and generates new ones based on total_pages
	 */
	const initialize_pagination = () => {
		// Clear existing page numbers
		page_numbers_container.innerHTML = ""

		for (let i = 1; i <= total_pages; i++) {
			const page_btn = document.createElement("button")
			page_btn.classList.add("page-number")
			page_btn.textContent = i

			if (i === 1)
				page_btn.classList.add("active")

			page_btn.addEventListener("click", () => render_page(i))
			page_numbers_container.appendChild(page_btn)
		}
	}

	/**
	 * Refreshes the entire pagination system
	 * Updates variables, reinitializes controls, and renders the first page
	 */
	const refresh_pagination = () => {
		update_variables()
		initialize_pagination()
		render_page(1)
	}

	// Listen for content updates from search/filter module
	document.addEventListener("blogContentUpdated", refresh_pagination)

	// Navigation button event listeners
	prev_btn.addEventListener("click", () => render_page(current_page - 1))
	next_btn.addEventListener("click", () => render_page(current_page + 1))

	refresh_pagination()
})
