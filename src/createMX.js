import { snakeCase } from "change-case";
import merge from "deepmerge";
const mxMode = getMXMode();
const isMobile = window.innerWidth <= 1024;
const isDesktop = window.innerWidth > 1024;
const isDev = mxMode === "dev";
const isTest = mxMode === "test";
const isProd = mxMode === "prod";
const kebabCase = (...args) => snakeCase(...args).replace(/_/g, "-");
const mxConfig = {
    mxMode,
    isMobile,
    isDesktop,
    isDev,
    isTest,
    isProd,
};
let MX = null;
const defaultResources = {
    id: "resources",
    title: "Resources",
    order: 1,
    links: {
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
        bottom: [
            {
                title: "Support",
                href: "https://moneydesktop.zendesk.com/hc/en-us/restricted?return_to=https%3A%2F%2Fmoneydesktop.zendesk.com%2Fhc%2Fen-us",
            },
        ],
    },
};
const mxStores = { prod: {}, dev: {}, test: {} };
mxStores.prod.createMX = () => {
    function Dropdown(
        dropdownId = "resources",
        dropdownTitle = "Resources",
        order = 1,
        quickLinks = [
            {
                title: "MX Academy",
                href: "https://academy.mx.com/hc/en-us",
                target: "_blank",
            },
            {
                title: "MX Docs",
                href: "https://docs.mx.com/",
                target: "_blank",
            },
        ],
        mainLinks = [
            {
                title: "Support",
                href: "https://moneydesktop.zendesk.com/hc/en-us/restricted?return_to=https%3A%2F%2Fmoneydesktop.zendesk.com%2Fhc%2Fen-us",
                target: "_blank",
            },
        ]
    ) {
        const navMenuEl = document.querySelector(
            'nav[role="navigation"] ul.header-navigation-items_menu'
        );
        this.dropdownId = dropdownId;
        this.dropdownTitle = dropdownTitle;
        this.order = order;
        this.expanded = false;
        const qls = quickLinks?.length > 0 ? quickLinks : null;
        const mls = mainLinks?.length > 0 ? mainLinks : null;
        let index = 0;
        let qlHtml = qls
            ? `<ul class="main-menu-list main-menu-list--quicklinks"
        id="${dropdownId}-quicklinks">
        ${qls
            .map((ql) => {
                const i = index;
                index++;
                const { title, ...attrs } = ql;
                const linkAttrs = Object.keys(attrs)
                    .map((key) => `${key}="${attrs[key]}"`)
                    .join(" ");
                return `<li class="main-menu-list__item main-menu-list__item--no-hover mx mx-quicklink" id="downshift-1-item-${i}" role="option">
                <a ${linkAttrs} class="main-menu-link link--text">
                    ${title}
                </a>
            </li>`;
            })
            .join("")}
    </ul>`
            : "";

        let mlHtml = !!mls
            ? `<ul class="main-menu-list"
            id="${dropdownId}-mainlinks">
            ${mls
                .map((l) => {
                    const i = index;
                    index++;
                    const { title, ...attrs } = l;
                    const linkAttrs = Object.keys(attrs)
                        .map((key) => `${key}="${attrs[key]}"`)
                        .join(" ");
                    return `
                <li class="main-menu-list__item main-menu-list__item--no-hover mx mx-mainlink"
                    id="downshift-1-item-${i}"
                    role="option">
    
                    <a ${linkAttrs} title="${title}"
                    class="link--text main-menu-link main-menu-link--category">
                        <span>${title}</span>
                    </a>
                </li>
                `;
                })
                .join("")}
        </ul>`
            : ``;
        this.qlHtml = qlHtml;
        this.mlHtml = mlHtml;
        const t = this;
        this.html = createHtml(t);
        function toggle(expanded = null) {
            let next;
            if (typeof expanded === "boolean") {
                next = expanded;
            } else {
                next = !t.expanded;
            }
            t.expanded = next;
            if (next) {
                handleExpand(t);
            } else {
                handleCollapse(t);
            }
        }

        const close = () => toggle(false);
        const open = () => toggle(true);
        this.toggle = toggle;
        this.close = close;
        this.open = open;

        appendDropdown(this.html);
        function appendDropdown(html) {
            const parent = navMenuEl;
            // append to parent in order (where order - 1 = index )
            const siblings = parent.children;
            const index = t.order - 1;
            const tempEl = document.createElement("div");
            tempEl.innerHTML = html;
            const el = tempEl.children[0];
            if (siblings && siblings.length === 0) {
                parent.appendChild(el);
            } else if (siblings.length < index) {
                parent.appendChild(el);
            } else {
                parent.insertBefore(el, siblings[index + 1]);
            }

            listen();
        }
        function getEls() {
            const el = document.getElementById(`${dropdownId}-dropdown`);

            const parent = navMenuEl;

            const container = el.querySelector(".dropdown-container");

            const btn = el.querySelector(`#${dropdownId}-dropdown-btn`);

            const ul = el.querySelector(`ul[role="${dropdownId}-categories"]`);
            const mainLinksUl = document.getElementById(
                `${dropdownId}-mainlinks`
            );
            const quickLinksUl = document.getElementById(
                `${dropdownId}-quicklinks`
            );
            // remove is-hidden class from ul
            const quickLinks = el.querySelectorAll(`li.mx.mx-quicklink`);
            const mainLinks = el.querySelectorAll(`li.mx.mx-mainlink`);
            return {
                el,
                parent,
                container,
                btn,
                ul,
                mainLinksUl,
                quickLinksUl,
                links: [...quickLinks, ...mainLinks],
                get quickLinks() {
                    return quickLinks;
                },
                get mainLinks() {
                    return mainLinks;
                },
            };
        }

        function handleExpand() {
            const { ul, links, btn } = getEls();
            btn.setAttribute("aria-expanded", "true");
            removeClass(ul, "is-hidden");
            links.forEach((link) => {
                link.setAttribute("aria-hidden", "false");
            });
            links[0].focus();
        }
        function handleCollapse() {
            const { ul, links, btn } = getEls();
            links.forEach((link) => {
                link.setAttribute("aria-hidden", "true");
            });
            if (!ul.classList.contains("is-hidden")) {
                addClass(ul, "is-hidden");
            }
            btn.setAttribute("aria-expanded", "false");
            btn.focus();
        }
        function listen() {
            const { el, container, links, btn } = getEls();
            btn.addEventListener("click", (e) => {
                // e.preventDefault();

                const next = !t.expanded;
                t.expanded = next;
                if (next) {
                    handleExpand();
                } else {
                    handleCollapse();
                }
            });

            btn.addEventListener("keyup", (e) => {
                
                if (e.key === "ArrowDown" || e.key === "Enter") {
                    e.preventDefault();
                    t.open();
                    setTimeout(() => {
                        const firstLink = links[0];
                        if (firstLink) {
                            firstLink.focus();
                            firstLink.dispatchEvent(new Event("focus"));
                        }
                    }, 100);
                }
                if (e.key === "ArrowUp" || e.key === "Escape") {
                    e.preventDefault();
                    t.close();
                }
            });
            links.forEach((link) => {
                const cls = "main-menu-list__item--highlighted";
                link.addEventListener("click", (e) => {
                    t.toggle(false);
                    addClass(e.target, cls);
                });
                link.addEventListener("focus", (e) => {
                    addClass(e.target, cls);
                });
                link.addEventListener("blur", (e) => {
                    removeClass(e.target, cls);
                });
                link.addEventListener("mouseover", (e) => {
                    addClass(e.target, cls);
                });
                link.addEventListener("mouseout", (e) => {
                    removeClass(e.target, cls);
                });
                // link.addEventListener("keyup", (e) => {
                //     const item = e.target;
                //     const key = e.key;
                //     // console.log('keyup', {key, event: e})
                // });
            });
            // document.body.addEventListener("click", (e) => {
            //     if (!el.contains(e.target)) {
            //         t.toggle(false);
            //     }
            // });
            // container.addEventListener("keydown", (e) => {
            //     if (e.key === "Escape") {
            //         t.toggle(false);
            //     }
            // });
        }
        return this;
    }

    function createHtml(state) {
        const { dropdownId, dropdownTitle, order, expanded, qlHtml, mlHtml } =
            state;
        return `<li class="header-navigation_list-item main-menu"
        id="${dropdownId}-dropdown">
        <div class="dropdown-container"><button aria-haspopup="${dropdownId}-categories"
                    type="button"
                    id='${dropdownId}-dropdown-btn'
                    style="background: none; border: none; font-weight: inherit; display: inline-block; padding: 0px; margin: 0px; cursor: pointer;">
                <span style="display: flex; align-items: center;"
                      class="main-menu-trigger"
                      role="combobox"
                      aria-haspopup="listbox"
                      aria-labelledby="downshift-1-label"
                      aria-autocomplete="list"
                      value=""
                      id="downshift-1-input"
                      autocomplete="off">
                    <span>${dropdownTitle}</span>
                    <svg aria-hidden="true"
                         width="16"
                         height="16"
                         class=""
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                              fill="currentColor"></path>
    
                    </svg></span></button>
            <ul role="${dropdownId}-categories"
                class="dropdown dropdown--forums-overview is-hidden"
                component="ul"
                tabindex="-1">
                <li aria-hidden="true"
                    class="arrow is-hidden-S"></li>
                <li class="main-menu-list--overflow-scroll">
                    ${qlHtml}
                    ${mlHtml}
                </li>
            </ul>
        </div>
    </li>`;
    }

    function removeClass($el, $cls) {
        try {
            $el.classList.remove($cls);
        } catch {
            // do nothing
        }
    }
    function addClass($el, $cls) {
        try {
            if (!$el.classList.contains($cls)) {
                $el.classList.add($cls);
            }
        } catch {
            // do nothing
        }
    }
    function toggleClass($el, $cls) {
        try {
            if ($el.classList.contains($cls)) {
                $el.classList.remove($cls);
            } else {
                $el.classList.add($cls);
            }
        } catch {
            // do nothing
        }
    }
    return {
        Dropdown,
        removeClass,
        addClass,
        toggleClass,
    };
};
mxStores.prod.runMX = () => {
    try {
        if (window.innerWidth <= 1024) {
            return;
        }
        const mx = MX || mxStores.prod.createMX();
        MX = mx;
        const { Dropdown } = mx;
        const customResources =
            typeof resourcesDropdown !== "undefined"
                ? { ...defaultResources, resourcesDropdown }
                : { ...defaultResources };

        const rs = {
            ...merge.all([
                { id: "resources" },
                defaultResources,
                customResources,
            ]),
            links: {
                top: customResources.links.top || defaultResources.links.top,
                bottom:
                    customResources.links.bottom ||
                    defaultResources.links.bottom,
            },
        };
        const hideLink = (link) => {
            var { title } = link;
            var suffix,
                sel,
                parent,
                ele = null;

            suffix = kebabCase(`${title}`);
            sel = `a.header-navigation_link.title-${suffix}`;
            parent.classList.add("nav-item-hidden");
            parent.style.display = "none";
            try {
                ele = document.querySelector(sel);
                if (typeof ele === "undefined" || !ele) return null;
                parent = ele.parentElement;
                if (!!parent) {
                    try {
                        parent.classList.add("nav-item-hidden");
                        parent.style.display = "none";
                    } catch {
                        return null;
                    }
                }
            } catch (e) {
                return null;
            }
        };
        const onLinks = (links) =>
            links.map((l) => ({ ...l, target: "_blank" }));
        const topLinks = onLinks(rs.links.top);
        const bottomLinks = onLinks(rs.links.bottom);
        try {
            [...topLinks, ...bottomLinks].forEach((l) => {
                try {
                    hideLink(l);
                } catch {
                    // do nothing
                }
            });
        } catch {
            // do nothing
        }
        new Dropdown(rs.id, rs.title, rs.order, topLinks, bottomLinks);
        const hideReplaced = () =>
            [
                "a.header-navigation_link.title-mx-docs",
                "a.header-navigation_link.title-support",
                "a.header-navigation_link.title-mx-academy",
                "a.header-navigation_link.title-developer-portal",
            ].forEach((sel) => {
                const ele = document.querySelector(sel);
                const parent = ele.parentElement;
                parent.classList.add("nav-item-hidden");
                parent.style.display = "none";
            });
        try {
            hideReplaced();
        } catch {
            // do nothing
        }
    } catch (mxCommunityCustomDropdownError) {
        console.warn(
            "Error @ mxCommunityCustomDropdownError \nPlease inform Tyler Grow of the error. More details below...\n"
        );
        console.warn(mxCommunityCustomDropdownError);
    }
};
let mxStore = mxStores[mxMode] || null;
const { createMX, runMX } = mxStore ? mxStore : mxStores.prod;
MX = createMX();
if (!isProd) {
    console.log("mxConfig", mxConfig);
    console.log("mxMode", mxMode);
    console.log(
        `This mode doesn't have an mxStore or methods.\nYou can run the production store by running "runMX()", or mxStores.prod.runMX()`
    );
} else {
    (() => runMX())();
}

function getMXMode() {
    const loc = window.location.href;
    if (loc.indexOf("mxmode=dev") > -1) {
        return "dev";
    } else if (loc.indexOf("mxmode=test") > -1) {
        return "test";
    } else {
        return "prod";
    }
}

export { getMXMode, mxStores, mxConfig, mxMode, mxStore, createMX, runMX, MX };
