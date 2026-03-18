package com.codeflow.editor.data.model

data class Snippet(
    val prefix: String,
    val label: String,
    val body: String,
    val description: String = "",
    val language: String = ""
)

object BuiltInSnippets {

    fun getSnippetsForLanguage(language: String): List<Snippet> {
        val universal = universalSnippets()
        val langSpecific = when (language) {
            "javascript", "javascriptreact", "typescript", "typescriptreact" -> jsSnippets()
            "python" -> pythonSnippets()
            "java" -> javaSnippets()
            "kotlin" -> kotlinSnippets()
            "html" -> htmlSnippets()
            "css", "scss", "less" -> cssSnippets()
            else -> emptyList()
        }
        return langSpecific + universal
    }

    private fun universalSnippets() = listOf(
        Snippet("todo", "TODO Comment", "// TODO: ", "TODO yorum ekle"),
        Snippet("fixme", "FIXME Comment", "// FIXME: ", "FIXME yorum ekle"),
        Snippet("note", "NOTE Comment", "// NOTE: ", "NOT yorum ekle")
    )

    private fun jsSnippets() = listOf(
        Snippet("log", "console.log", "console.log()", "Konsola yazdır"),
        Snippet("fn", "Arrow Function", "const name = () => {\n\t\n}", "Ok fonksiyonu"),
        Snippet("afn", "Async Arrow Function", "const name = async () => {\n\t\n}", "Async ok fonksiyonu"),
        Snippet("if", "If Statement", "if (condition) {\n\t\n}", "If bloku"),
        Snippet("ife", "If-Else", "if (condition) {\n\t\n} else {\n\t\n}", "If-else bloku"),
        Snippet("for", "For Loop", "for (let i = 0; i < length; i++) {\n\t\n}", "For döngüsü"),
        Snippet("forin", "For-In Loop", "for (const key in object) {\n\t\n}", "For-in döngüsü"),
        Snippet("forof", "For-Of Loop", "for (const item of iterable) {\n\t\n}", "For-of döngüsü"),
        Snippet("map", "Array Map", "array.map((item) => {\n\treturn item\n})", "Array map"),
        Snippet("filter", "Array Filter", "array.filter((item) => {\n\treturn item\n})", "Array filter"),
        Snippet("try", "Try-Catch", "try {\n\t\n} catch (error) {\n\t\n}", "Try-catch bloku"),
        Snippet("imp", "Import", "import { } from ''", "Import ifadesi"),
        Snippet("exp", "Export Default", "export default ", "Default export"),
        Snippet("class", "Class", "class ClassName {\n\tconstructor() {\n\t\t\n\t}\n}", "Sınıf tanımı"),
        Snippet("fetch", "Fetch API", "const response = await fetch(url)\nconst data = await response.json()", "Fetch API çağrısı"),
        Snippet("usestate", "useState Hook", "const [state, setState] = useState(initialValue)", "React useState"),
        Snippet("useeffect", "useEffect Hook", "useEffect(() => {\n\t\n\treturn () => {\n\t\t\n\t}\n}, [])", "React useEffect")
    )

    private fun pythonSnippets() = listOf(
        Snippet("def", "Function", "def function_name():\n\tpass", "Fonksiyon tanımı"),
        Snippet("class", "Class", "class ClassName:\n\tdef __init__(self):\n\t\tpass", "Sınıf tanımı"),
        Snippet("if", "If Statement", "if condition:\n\tpass", "If bloku"),
        Snippet("ife", "If-Else", "if condition:\n\tpass\nelse:\n\tpass", "If-else bloku"),
        Snippet("for", "For Loop", "for item in iterable:\n\tpass", "For döngüsü"),
        Snippet("while", "While Loop", "while condition:\n\tpass", "While döngüsü"),
        Snippet("try", "Try-Except", "try:\n\tpass\nexcept Exception as e:\n\tpass", "Try-except bloku"),
        Snippet("with", "With Statement", "with open('file') as f:\n\tpass", "With bloku"),
        Snippet("list", "List Comprehension", "[x for x in iterable]", "Liste anlaması"),
        Snippet("dict", "Dict Comprehension", "{k: v for k, v in iterable}", "Sözlük anlaması"),
        Snippet("main", "Main Block", "if __name__ == '__main__':\n\tmain()", "Main bloku"),
        Snippet("imp", "Import", "import ", "Import ifadesi"),
        Snippet("from", "From Import", "from module import ", "From import ifadesi"),
        Snippet("print", "Print", "print()", "Print fonksiyonu"),
        Snippet("lambda", "Lambda", "lambda x: x", "Lambda ifadesi")
    )

    private fun javaSnippets() = listOf(
        Snippet("main", "Main Method", "public static void main(String[] args) {\n\t\n}", "Main metodu"),
        Snippet("sout", "System.out.println", "System.out.println()", "Konsola yazdır"),
        Snippet("if", "If Statement", "if (condition) {\n\t\n}", "If bloku"),
        Snippet("for", "For Loop", "for (int i = 0; i < length; i++) {\n\t\n}", "For döngüsü"),
        Snippet("foreach", "Enhanced For", "for (Type item : collection) {\n\t\n}", "Gelişmiş for"),
        Snippet("try", "Try-Catch", "try {\n\t\n} catch (Exception e) {\n\te.printStackTrace();\n}", "Try-catch"),
        Snippet("class", "Class", "public class ClassName {\n\t\n}", "Sınıf tanımı"),
        Snippet("intf", "Interface", "public interface InterfaceName {\n\t\n}", "Arayüz tanımı")
    )

    private fun kotlinSnippets() = listOf(
        Snippet("fun", "Function", "fun functionName() {\n\t\n}", "Fonksiyon tanımı"),
        Snippet("main", "Main Function", "fun main(args: Array<String>) {\n\t\n}", "Main fonksiyonu"),
        Snippet("if", "If Expression", "if (condition) {\n\t\n}", "If ifadesi"),
        Snippet("when", "When Expression", "when (value) {\n\telse -> {}\n}", "When ifadesi"),
        Snippet("for", "For Loop", "for (item in collection) {\n\t\n}", "For döngüsü"),
        Snippet("try", "Try-Catch", "try {\n\t\n} catch (e: Exception) {\n\t\n}", "Try-catch"),
        Snippet("class", "Class", "class ClassName {\n\t\n}", "Sınıf tanımı"),
        Snippet("data", "Data Class", "data class ClassName(\n\tval name: String\n)", "Data sınıf"),
        Snippet("obj", "Object", "object ObjectName {\n\t\n}", "Object tanımı"),
        Snippet("lazy", "Lazy Property", "val name by lazy {\n\t\n}", "Lazy özellik"),
        Snippet("coroutine", "Launch Coroutine", "lifecycleScope.launch {\n\t\n}", "Coroutine başlat"),
        Snippet("comp", "Composable", "@Composable\nfun ComponentName() {\n\t\n}", "Composable fonksiyon")
    )

    private fun htmlSnippets() = listOf(
        Snippet("html5", "HTML5 Boilerplate",
            "<!DOCTYPE html>\n<html lang=\"tr\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t<title>Sayfa</title>\n</head>\n<body>\n\t\n</body>\n</html>",
            "HTML5 şablonu"),
        Snippet("div", "Div", "<div>\n\t\n</div>", "Div elementi"),
        Snippet("a", "Anchor", "<a href=\"\"></a>", "Link"),
        Snippet("img", "Image", "<img src=\"\" alt=\"\">", "Resim"),
        Snippet("ul", "Unordered List", "<ul>\n\t<li></li>\n</ul>", "Sırasız liste"),
        Snippet("ol", "Ordered List", "<ol>\n\t<li></li>\n</ol>", "Sıralı liste"),
        Snippet("table", "Table", "<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th></th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td></td>\n\t\t</tr>\n\t</tbody>\n</table>", "Tablo"),
        Snippet("form", "Form", "<form action=\"\" method=\"post\">\n\t\n</form>", "Form"),
        Snippet("input", "Input", "<input type=\"text\" name=\"\" id=\"\">", "Input"),
        Snippet("btn", "Button", "<button type=\"button\"></button>", "Buton"),
        Snippet("link", "CSS Link", "<link rel=\"stylesheet\" href=\"\">", "CSS bağlantısı"),
        Snippet("script", "Script Tag", "<script src=\"\"></script>", "Script etiketi")
    )

    private fun cssSnippets() = listOf(
        Snippet("flex", "Flexbox", "display: flex;\njustify-content: center;\nalign-items: center;", "Flexbox düzeni"),
        Snippet("grid", "Grid", "display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 16px;", "Grid düzeni"),
        Snippet("center", "Center Element", "display: flex;\njustify-content: center;\nalign-items: center;\nmin-height: 100vh;", "Elementi ortala"),
        Snippet("media", "Media Query", "@media (max-width: 768px) {\n\t\n}", "Medya sorgusu"),
        Snippet("var", "CSS Variable", "--variable-name: value;", "CSS değişkeni"),
        Snippet("trans", "Transition", "transition: all 0.3s ease;", "Geçiş efekti"),
        Snippet("anim", "Animation", "@keyframes animationName {\n\tfrom {\n\t\t\n\t}\n\tto {\n\t\t\n\t}\n}", "Animasyon"),
        Snippet("reset", "Box Reset", "margin: 0;\npadding: 0;\nbox-sizing: border-box;", "Kutu sıfırlama")
    )
}
