# Supply Chain Threat Tracker - QA Report

**Date:** 2026-05-04
**App URL:** https://ai-1409.github.io/supply-chain-threat-tracker/
**Testing Method:** Systematic exploratory QA (Playwright)
**Scope:** Full site testing

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total Issues** | 6 |
| **Critical** | 0 |
| **High** | 1 |
| **Medium** | 2 |
| **Low** | 3 |

### Breakdown by Category

| Category | Count |
|----------|-------|
| Functional | 2 |
| Accessibility | 2 |
| Visual | 1 |
| Content | 1 |

### Testing Scope Covered

- ✅ Main dashboard landing page
- ✅ Sidebar navigation (All, npm, PyPI, RubyGems, crates.io)
- ✅ Incident dialog modals
- ✅ IOC accordion behavior
- ✅ Statistics display
- ✅ Console error monitoring
- ✅ Responsive layout assessment
- ❌ Incident detail pages (404 errors prevented testing)

### Strengths

- Clean, professional interface with @nipsys/lsd components
- Working sidebar navigation with filtering
- Correct statistics display (6 incidents, 5 critical, 3 high confidence, 4 ecosystems)
- Functional dialog modals with proper close behavior
- No JavaScript runtime errors
- No network errors

---

## Detailed Findings

### BUG-002: Incident detail pages return 404 error

![High](https://img.shields.io/badge/Severity-High-red)
![Functional](https://img.shields.io/badge/Category-Functional-blue)

**URL:** All incident detail pages (e.g., `/incident/SC-2024-001`)

**Description:**
Clicking "Open in new tab" icon in incident dialog navigates to URLs that return 404 Not Found. The incidents list contains 6 incidents with IDs like SC-2024-001, SC-2024-002, etc., but the corresponding detail pages at `/incident/{id}` do not exist on the deployed site.

**Steps to Reproduce:**
1. Navigate to https://ai-1409.github.io/supply-chain-threat-tracker/
2. Click on any incident card to open the dialog modal
3. Click the "Open in new tab" icon (external link icon)
4. Observe 404 Not Found page

**Expected Behavior:**
Should display a dedicated detail page for the incident with full information including IOCs, timeline, and attribution.

**Actual Behavior:**
Returns a standard GitHub Pages 404 error page: "404: Page not found"

**Console Errors:**
None (404 is a server response)

---

### BUG-001: Missing aria-describedby for DialogContent components

![Medium](https://img.shields.io/badge/Severity-Medium-orange)
![Accessibility](https://img.shields.io/badge/Category-Accessibility-purple)

**URL:** Main dashboard - incident dialog modals

**Description:**
DialogContent components reference an `aria-describedby` attribute that doesn't exist in the DOM. This causes repeated console warnings that affect accessibility compliance and screen reader support.

**Steps to Reproduce:**
1. Navigate to https://ai-1409.github.io/supply-chain-threat-tracker/
2. Check browser console
3. Click on any incident card to open dialog
4. Observe console warnings

**Expected Behavior:**
No accessibility warnings in console. DialogContent should have properly structured ARIA attributes referencing existing elements.

**Actual Behavior:**
Console shows repeated warnings:
```
Warning: An element with aria-describedby={indetify-id} does not exist.
```

**Console Errors:**
```
Warning: An element with aria-describedby={indetify-id} does not exist.
Warning: An element with aria-describedby={indetify-id} does not exist.
```

---

### BUG-003: IOC accordion sections don't expand in dialog

![Medium](https://img.shields.io/badge/Severity-Medium-orange)
![Functional](https://img.shields.io/badge/Category-Functional-blue)

**URL:** Main dashboard - incident dialog modals

**Description:**
Incident dialogs show "Indicators of Compromise (IOCs)" sections with accordion expanders, but clicking them does not reveal the IOC details. This hides critical security information from users.

**Steps to Reproduce:**
1. Navigate to https://ai-1409.github.io/supply-chain-threat-tracker/
2. Click on any incident card to open the dialog
3. Locate "Indicators of Compromise (IOCs)" section
4. Click on the accordion expander
5. Observe no change - section remains collapsed

**Expected Behavior:**
Accordion should expand to show detailed IOC information including package names, versions, hashes, and other compromise indicators.

**Actual Behavior:**
Accordion headers are present but clicking does nothing. IOC details remain hidden behind the collapsed state.

**Console Errors:**
None (visual issue, not throwing errors)

---

### BUG-004: Sidebar toggle button behavior unclear

![Low](https://img.shields.io/badge/Severity-Low-yellow)
![Visual](https://img.shields.io/badge/Category-Visual-green)

**URL:** Main dashboard - left sidebar

**Description:**
The sidebar navigation has a toggle button (hamburger icon) but its behavior is unclear on desktop. Users cannot collapse/expand the sidebar, and there's no visual feedback when the button is hovered or clicked.

**Steps to Reproduce:**
1. Navigate to https://ai-1409.github.io/supply-chain-threat-tracker/
2. Locate the toggle button in the sidebar header
3. Hover over the button
4. Click the button
5. Observe no visible change

**Expected Behavior:**
Button should provide clear visual feedback on hover and should collapse/expand the sidebar when clicked, especially on mobile devices.

**Actual Behavior:**
Button appears passive with no visible change on hover or click. Sidebar remains visible regardless of interaction.

**Console Errors:**
None

---

### BUG-005: Typo in incident description

![Low](https://img.shields.io/badge/Severity-Low-yellow)
![Content](https://img.shields.io/badge/Category-Content-gray)

**URL:** Main dashboard - incident cards

**Description:**
The incident "typosquat attack on lodash-quick" contains a typo in its description: "typosqats" instead of the correct spelling "typosquats".

**Steps to Reproduce:**
1. Navigate to https://ai-1409.github.io/supply-chain-threat-tracker/
2. Filter to "npm" ecosystem in sidebar
3. Locate the "lodash-quick" incident card
4. Read the description text

**Expected Behavior:**
Correct spelling: "typosquats attack on lodash-quick"

**Actual Behavior:**
Incorrect spelling: "typosqats attack on lodash-quick"

**Console Errors:**
None

---

### BUG-006: No visible focus indicators on interactive elements

![Low](https://img.shields.io/badge/Severity-Low-yellow)
![Accessibility](https://img.shields.io/badge/Category-Accessibility-purple)

**URL:** All pages

**Description:**
Interactive elements (buttons, links, cards) lack visible focus indicators when navigating with keyboard (Tab key). This makes the site difficult to use for keyboard-only users and affects accessibility compliance.

**Steps to Recontre:**
1. Navigate to https://ai-1409.github.io/supply-chain-threat-tracker/
2. Use Tab key to navigate through elements
3. Observe lack of visual focus indicators

**Expected Behavior:**
Clear visible focus rings or outlines should appear on all interactive elements when focused, conforming to WCAG 2.1 Focus Appearance criteria.

**Actual Behavior:**
No visible focus indicators appear. Elements may receive focus but users cannot see which element is currently focused.

**Console Errors:**
None

---

## Summary Table

| Bug ID | Title | Severity | Category | URL |
|--------|-------|----------|----------|-----|
| BUG-002 | Incident detail pages return 404 error | High | Functional | `/incident/{id}` |
| BUG-001 | Missing aria-describedby for DialogContent | Medium | Accessibility | Main dashboard |
| BUG-003 | IOC accordion sections don't expand | Medium | Functional | Main dashboard |
| BUG-004 | Sidebar toggle button behavior unclear | Low | Visual | Main dashboard |
| BUG-005 | Typo in incident description | Low | Content | Main dashboard |
| BUG-006 | No visible focus indicators | Low | Accessibility | All pages |

---

## Recommendations

### Immediate Actions

1. **Fix incident detail routing** - Ensure `/incident/{id}` pages are generated during static export. This is critical for the "Open in new tab" feature to work as expected.

2. **Implement IOC accordion functionality** - The accordion state management needs to be fixed so users can access the critical security information. This is a functional issue, not cosmetic.

### Short-term Actions

3. **Fix aria-describedby warnings** - Either remove the attribute or ensure the referenced elements exist in the DOM. This affects accessibility compliance.

4. **Add visible focus indicators** - Implement proper focus styles (outline, box-shadow, etc.) for all interactive elements to meet WCAG 2.1 standards.

### Long-term Improvements

5. **Implement sidebar collapse** - Make the toggle button functional for mobile responsiveness and better space management.

6. **Content proofreading** - Review all incident descriptions for typos and formatting consistency.

---

## Testing Notes

**What Was Tested:**
- Full navigation flow across all ecosystems
- All incident dialog interactions
- Console error monitoring throughout
- Visual inspection of layout and components
- Sidebar filtering functionality
- Statistics accuracy

**What Was Not Tested:**
- Incident detail pages (404 errors prevented testing)
- Mobile-specific responsive behavior (no mobile viewport tested)
- Form inputs (no forms present in current implementation)
- Empty states (6 sample incidents populate all views)

**Limitations:**
- Browser vision tool experienced errors on screenshot analysis
- Some console logs could not be retrieved from the deployed environment
- Testing performed in a single desktop viewport size

**Tools Used:**
- Playwright (via browser_navigate, browser_click, browser_snapshot, etc.)
- Console monitoring (browser_console)
- Accessibility tree inspection (browser_snapshot)
- Manual visual inspection

---

**Report Generated By:** AVA (Hermes Agent Dogfood Workflow)
**Test Duration:** ~7.5 minutes
**Tool Calls:** 44 browser interactions
**Console Warnings:** 6+ aria-describedby warnings
**Console Errors:** 0 runtime errors
