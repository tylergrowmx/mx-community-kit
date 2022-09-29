# mx-community-kit
How to Update
1. Log into MX Community Dashboard (as Admin)
2. Navigate to [Configuration/Third Party Scripts](https://mx-en.insided.com/configuration/third-party-scripts)
3. Update the script at bottom of the page ("Before </Body>")

## Example / Addtl. documentation
```html
<!-- 
	Use `resourcesDropdown[Link]` variable to Create/edit/delete links in Resources Dropdown
	-	`resourcesDropdown` must be defined before the 'mx-community-kit' script tag (below).
    Link Scheme: {
        title: String, 
        href: String (URL)
    }	
  	**	See the `resourcesDropdown` variable below for examples and more.
  	** 	Reach out to Tyler Grow on Slack with Questions
	Last Update: Tyler Grow - 2022.09.27  			

 -->
<script>
  var resourcesDropdown = {
    // title: Changing this will change the title of the Dropdown
    title: "Resources", 
    // Order: Changing this will change the order in which the dropdown appears (left to right, starting at 0)
    order: 1, 
    // links: See "Use `resourcesDropdown[Link]`..." above for more info
    links: { 
      	// links.top: These links appear above the line-break in the dropdown menu
       top: [
            {
                title: "MX Academy",
                href: "https://academy.mx.com/hc/en-us",
            },
            {
                title: "MX Docs",
                href: "https://docs.mx.com/",
            },
          	{
                title: "Developer Portal",
                href: "https://developer.mx.com/",
            },
        ],
      	// links.bottom: These links appear below the line-break in the dropdown menu
        bottom: [
            
            {
                title: "Support",
                href: "https://moneydesktop.zendesk.com/hc/en-us/restricted?return_to=https%3A%2F%2Fmoneydesktop.zendesk.com%2Fhc%2Fen-us",
            },
        ], 
    },
}

</script>

<!-- 
	mx-community-kit script tag
	-	`resourcesDropdown` should be defined before this tag.
	Last Update: Tyler - 2022.09.27 - Moved to Github 

-->
<script src="https://cdn.jsdelivr.net/gh/tylergrowmx/mx-community-kit@1.5.0/dist/index.min.js"></script>

```
