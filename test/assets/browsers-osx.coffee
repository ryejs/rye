module.exports = (browser, url) ->
    switch browser
        when 'Firefox'
            """
            tell application "Firefox"
                open location "#{url}"
                activate
            end tell
            """
        when 'Safari'
            """
            tell application "Safari"
                reopen
                tell front window
                    set newTab to make new tab
                    set the URL of newTab to "#{url}"
                    set the current tab to newTab
                    activate
                end tell
            end tell
            """
        when 'Google Chrome'
            """
            set site to "#{url}"
            tell application "Google Chrome"
                reopen
                activate
                tell window 1
                    make new tab with properties {URL:site}
                end tell
            end tell
            """