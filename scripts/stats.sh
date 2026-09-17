#!/bin/bash
# Подсчёт слов учебника и числа шпаргалок (стиль Word)
# Китайский: каждый иероглиф — 1 слово; русский/английский: каждое слово — 1
# Если perl недоступен (например, в контейнере сборки), оставляем готовый
# docs/data/stats.json как есть и выходим успешно, чтобы не ронять сборку.
if ! command -v perl >/dev/null 2>&1; then
  echo "stats.sh: perl not found, keeping existing docs/data/stats.json"
  exit 0
fi

count_words() {
  local file="$1"
  
  cat "$file" | perl -CS -0777 -ne '
    use utf8;
    # 去掉 frontmatter
    s/^---\n.*?\n---\n//s;
    
    # 统计中文字符（使用 Unicode 属性）
    my @chinese = /\p{Han}/g;
    my $cn_count = scalar @chinese;
    
    # 去掉中文，提取英文单词
    s/\p{Han}/ /g;
    # 去掉 Markdown 语法和标点
    s/[#*|`\[\](){}<>:：，。！？、；""'"'"'"—…·\-_=+\/\\@$%^&~]/ /g;
    # 提取英文单词
    my @words = /[a-zA-Z][a-zA-Z0-9]*/g;
    my $en_count = scalar @words;
    
    print $cn_count + $en_count;
  '
}

# 统计 docs 下所有 .md 文件（排除 .vitepress 目录）
total=0
while IFS= read -r file; do
  count=$(count_words "$file")
  total=$((total + count))
done < <(find docs -name "*.md" -type f ! -path "*/\.vitepress/*")

# 统计 4K 高清笔记数量
notes=$(find docs/public/images -name "*-notes.jpeg" ! -name "*.mini.jpeg" 2>/dev/null | wc -l | tr -d ' ')

# 生成 JSON
cat > docs/data/stats.json <<EOF
{
  "wordCount": $total,
  "notesCount": $notes
}
EOF

echo "教程字数：$total"
echo "4K笔记：$notes 张"
echo "✓ 已生成 docs/data/stats.json"
