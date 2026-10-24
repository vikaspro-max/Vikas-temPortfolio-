# Vikas Kumar - Portfolio

Personal portfolio website (HTML, CSS, JavaScript).

## Folder structure
```
index.html        main page
css/style.css     all styles (themes, liquid glass, animations)
js/script.js      all behaviour (theme, chat, confetti, form...)
images/vikas.jpg  profile photo
images/favicon.svg
```

## GitHub par upload kaise karein
1. github.com par naya repository banao, naam: `portfolio`
2. "uploading an existing file" par click karo
3. Is folder ke andar ki saari files aur folders (index.html, css, js, images) drag-drop karo
4. Commit karo

## Vercel par live kaise karein
1. vercel.com par GitHub se login karo
2. "Add New > Project" > `portfolio` repo import karo
3. Deploy dabao. Aapko `yourname.vercel.app` link mil jayega

## Features
- Liquid glass design, light/dark theme
- Smooth performance (heavy effects band ho jate hain agar device slow ho)
- Long-press karke kisi bhi card/photo ko uthao aur drag karo, chhodte hi wapas spring ho jata hai
- Skills filter (Programming, Web, Creative, Productivity)
- Chat assistant, contact form, share button

## Edit karne ki jagah
- Links aur text: `index.html`
- Colors: `css/style.css` ke top ke `:root` variables
- Chat ke jawab: `js/script.js` mein `rule()` function
