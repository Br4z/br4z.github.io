addEventListener("DOMContentLoaded", () => {
	const blog_list = document.querySelector(".blog-list")
	const prev_btn = document.querySelector(".blog-pagination .pagination-btn:first-child")
	const next_btn = document.querySelector(".blog-pagination .pagination-btn:last-child")
	const page_numbers_container = document.querySelector(".page-numbers")

	const posts = Array.from(document.querySelectorAll(".blog-item"))
	const post_per_page = 5
	const total_pages = Math.ceil(posts.length / post_per_page)

	let current_page = 1

	const render_page = (page) => {
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

	prev_btn.addEventListener("click", () => render_page(current_page - 1))
	next_btn.addEventListener("click", () => render_page(current_page + 1))
	initialize_pagination()
	render_page(1)
})