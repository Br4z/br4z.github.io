document.addEventListener("DOMContentLoaded", () => {
	const contact_form = document.querySelector("#contact form")
	const name_input = document.getElementById("name")
	const email_input = document.getElementById("email")

	const create_error_element = () => {
		const error_element = document.createElement("div")
		error_element.className = "error"

		return error_element
	}
	const name_error = create_error_element()
	const email_error = create_error_element()

	name_input.insertAdjacentElement("afterend", name_error)
	email_input.insertAdjacentElement("afterend", email_error)

	const validate_name = () => {
		if (name_input.value.trim() === "") {
			name_error.textContent = "Name is required"
			return false
		}
		name_error.textContent = ""
		return true
	}

	const validate_email = () => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!regex.test(email_input.value.trim())) {
			email_error.textContent = "Please enter a valid email address"
			return false
		}
		email_error.textContent = ""
		return true
	}
	// Real-time validation
	name_input.addEventListener("blur", validate_name)
	name_input.addEventListener("input", validate_name)
	email_input.addEventListener("blur", validate_email)
	email_input.addEventListener("input", validate_email)

	contact_form.addEventListener("submit", (e) => {
		const is_name_valid = validate_name()
		const is_email_valid = validate_email()

		if (!is_name_valid || !is_email_valid) {
			e.preventDefault()
			return
		}
	})
})
