from typing import Dict, Any
from diff_match_patch import diff_match_patch

dmp = diff_match_patch()

def compute_text_diff(original_text: str, current_text: str) -> Dict[str, Any]:
    """
    Compare original article text with current version using diff-match-patch.
    Generates added/removed word statistics and HTML with visual highlights.
    """
    diffs = dmp.diff_main(original_text, current_text)
    dmp.diff_cleanupSemantic(diffs)

    added_words = 0
    removed_words = 0
    html_parts = []

    for op, data in diffs:
        # op: -1 = delete, 0 = equal, 1 = insert
        escaped_data = data.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        words_count = len(data.split())

        if op == -1:
            removed_words += words_count
            html_parts.append(
                f'<span class="bg-red-500/20 text-red-400 line-through px-1 rounded mx-0.5">{escaped_data}</span>'
            )
        elif op == 1:
            added_words += words_count
            html_parts.append(
                f'<span class="bg-emerald-500/20 text-emerald-400 underline decoration-emerald-500 px-1 rounded mx-0.5">{escaped_data}</span>'
            )
        else:
            html_parts.append(f'<span>{escaped_data}</span>')

    diff_html = "".join(html_parts)

    return {
        "addedWords": added_words,
        "removedWords": removed_words,
        "diffHtml": diff_html,
    }
