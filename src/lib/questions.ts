export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionTopic =
  | "Python Fundamentals"
  | "Strings and Arrays"
  | "Dictionaries and Sets"
  | "Stacks and Queues"
  | "Sorting and Searching"
  | "Two Pointers"
  | "Sliding Window"
  | "Recursion"
  | "Basic Dynamic Programming"
  | "SQL and Data Manipulation"
  | "AI / Data Engineering Fundamentals";

export type Example = {
  input: string;
  output: string;
  explanation: string;
};

export type PublicTest = {
  input: string;
  expected: string;
  description: string;
};

export type Question = {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: QuestionTopic;
  description: string;
  inputOutput: string;
  constraints: string[];
  examples: Example[];
  starterCode: string;
  publicTests: PublicTest[];
  referenceSolution: string;
  explanation: string;
  expectedTime: string;
  expectedSpace: string;
  hints: string[];
};

export const questions: Question[] = [
  {
    id: "py-fund-01",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Python Fundamentals",
    description: "Given an array of integers and a target value, return the indices of two numbers that add up to the target.",
    inputOutput: "Return two indices as a list, or an empty list if no pair exists.",
    constraints: ["1 <= len(nums) <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists for each test case."],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9."
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "2 + 4 equals the target."
      }
    ],
    starterCode: "def two_sum(nums, target):\n    pass\n",
    publicTests: [
      { input: "nums = [2, 7, 11, 15], target = 9", expected: "[0, 1]", description: "Classic target match" },
      { input: "nums = [3, 2, 4], target = 6", expected: "[1, 2]", description: "Second valid pair" }
    ],
    referenceSolution: `def two_sum(nums, target):\n    seen = {}\n    for index, value in enumerate(nums):\n        diff = target - value\n        if diff in seen:\n            return [seen[diff], index]\n        seen[value] = index\n    return []\n`,
    explanation: "Use a hash map to store each seen value with its index. When a difference is found, return the pair immediately.",
    expectedTime: "O(n)",
    expectedSpace: "O(n)",
    hints: [
      "Think about looking up previously seen values in constant time.",
      "A dictionary can map a value to its index.",
      "If target - current_value has already been seen, you found the pair."
    ]
  },
  {
    id: "py-fund-02",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stacks and Queues",
    description: "Determine whether a string containing brackets is valid and properly nested.",
    inputOutput: "Return True if the brackets are balanced, otherwise False.",
    constraints: ["1 <= len(s) <= 10^5", "s consists only of brackets: (), {}, []"],
    examples: [
      { input: "s = '{[()]}'", output: "True", explanation: "The sequence is balanced." },
      { input: "s = '([)]'", output: "False", explanation: "The closing order is invalid." }
    ],
    starterCode: "def is_valid_parentheses(s):\n    pass\n",
    publicTests: [
      { input: "s = '{[()]}'", expected: "True", description: "Balanced nesting" },
      { input: "s = '([)]'", expected: "False", description: "Mismatched closing order" }
    ],
    referenceSolution: `def is_valid_parentheses(s):\n    pairs = {')': '(', '}': '{', ']': '['}\n    stack = []\n    for ch in s:\n        if ch in pairs.values():\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            continue\n    return not stack\n`,
    explanation: "Push opening brackets and pop when a closing bracket appears. If the top of the stack does not match, the string is invalid.",
    expectedTime: "O(n)",
    expectedSpace: "O(n)",
    hints: [
      "Use a stack to track unmatched opening brackets.",
      "The last opening bracket must match the next closing bracket.",
      "If the stack is empty when a closing bracket appears, the string is invalid."
    ]
  },
  {
    id: "py-fund-03",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings and Arrays",
    description: "Find the length of the longest substring without repeating characters.",
    inputOutput: "Return the maximum length of a valid substring.",
    constraints: ["0 <= len(s) <= 5 * 10^4", "s consists of English letters, digits, symbols, and spaces."],
    examples: [
      { input: "s = 'abcabcbb'", output: "3", explanation: "'abc' is the longest unique substring." },
      { input: "s = 'bbbbb'", output: "1", explanation: "All characters repeat." }
    ],
    starterCode: "def length_of_longest_substring(s):\n    pass\n",
    publicTests: [
      { input: "s = 'abcabcbb'", expected: "3", description: "Repeated characters" },
      { input: "s = 'pwwkew'", expected: "3", description: "Longest unique at the end" }
    ],
    referenceSolution: `def length_of_longest_substring(s):\n    left = 0\n    longest = 0\n    last_seen = {}\n    for right, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= left:\n            left = last_seen[ch] + 1\n        last_seen[ch] = right\n        longest = max(longest, right - left + 1)\n    return longest\n`,
    explanation: "Slide a window over the string, and track the most recent index of each character. When a duplicate appears, move the left pointer forward.",
    expectedTime: "O(n)",
    expectedSpace: "O(n)",
    hints: [
      "A sliding window is a good fit.",
      "Keep the most recent index of each character.",
      "When you see a duplicate, shrink the window from the left."
    ]
  },
  {
    id: "py-fund-04",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Sorting and Searching",
    description: "Merge two sorted lists into one sorted list without using built-in sort.",
    inputOutput: "Return the merged sorted list.",
    constraints: ["Both lists are sorted in nondecreasing order.", "Lengths can vary from 0 to 10^5."],
    examples: [
      { input: "a = [1, 2, 4], b = [1, 3, 4]", output: "[1, 1, 2, 3, 4, 4]", explanation: "Merge both sequences while preserving sort order." },
      { input: "a = [], b = [0]", output: "[0]", explanation: "Empty list case." }
    ],
    starterCode: "def merge_sorted_lists(a, b):\n    pass\n",
    publicTests: [
      { input: "a = [1, 2, 4], b = [1, 3, 4]", expected: "[1, 1, 2, 3, 4, 4]", description: "Classic merge" },
      { input: "a = [], b = [0]", expected: "[0]", description: "Edge case with empty list" }
    ],
    referenceSolution: `def merge_sorted_lists(a, b):\n    merged = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            merged.append(a[i])\n            i += 1\n        else:\n            merged.append(b[j])\n            j += 1\n    merged.extend(a[i:])\n    merged.extend(b[j:])\n    return merged\n`,
    explanation: "Compare the next remaining value from each list and append the smaller one until all items are consumed.",
    expectedTime: "O(n + m)",
    expectedSpace: "O(n + m)",
    hints: [
      "This is the classic merge step from mergesort.",
      "Keep two indices, one per list.",
      "Append the smaller current value and advance that index."
    ]
  },
  {
    id: "py-fund-05",
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "Dictionaries and Sets",
    description: "Group strings that are anagrams of each other.",
    inputOutput: "Return a list of groups, each containing anagrams from the input.",
    constraints: ["1 <= len(words) <= 10^4", "Strings may be empty or lowercase alphabetic."],
    examples: [
      { input: "words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']", output: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", explanation: "Words are grouped by sorted character signature." },
      { input: "words = ['abc']", output: "[['abc']]", explanation: "Single-word group." }
    ],
    starterCode: "def group_anagrams(words):\n    pass\n",
    publicTests: [
      { input: "words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']", expected: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", description: "Multiple groups" },
      { input: "words = ['abc']", expected: "[['abc']]", description: "One item" }
    ],
    referenceSolution: `def group_anagrams(words):\n    groups = {}\n    for word in words:\n        key = ''.join(sorted(word))\n        groups.setdefault(key, []).append(word)\n    return list(groups.values())\n`,
    explanation: "Sort each string to create a canonical key. Strings with the same key are anagrams of each other.",
    expectedTime: "O(n * k log k)",
    expectedSpace: "O(n * k)",
    hints: [
      "Anagrams share the same sorted letters.",
      "Use the sorted string as a dictionary key.",
      "Collect words by signature in a hash map."
    ]
  },
  {
    id: "py-fund-06",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Two Pointers",
    description: "Compute the maximum profit by choosing one buy day and one later sell day.",
    inputOutput: "Return the highest profit possible.",
    constraints: ["1 <= len(prices) <= 10^5", "0 <= prices[i] <= 10^4"],
    examples: [
      { input: "prices = [7, 1, 5, 3, 6, 4]", output: "5", explanation: "Buy at 1 and sell at 6 for a profit of 5." },
      { input: "prices = [7, 6, 4, 3, 1]", output: "0", explanation: "No profit is possible." }
    ],
    starterCode: "def max_profit(prices):\n    pass\n",
    publicTests: [
      { input: "prices = [7, 1, 5, 3, 6, 4]", expected: "5", description: "Profitable sequence" },
      { input: "prices = [7, 6, 4, 3, 1]", expected: "0", description: "No profitable trade" }
    ],
    referenceSolution: `def max_profit(prices):\n    min_price = float('inf')\n    best_profit = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        best_profit = max(best_profit, price - min_price)\n    return best_profit\n`,
    explanation: "Track the lowest price seen so far and compute the best profit for each future price.",
    expectedTime: "O(n)",
    expectedSpace: "O(1)",
    hints: [
      "Keep a running minimum value.",
      "Compute profit against the lowest observed price.",
      "Profit is just current price minus the minimum so far."
    ]
  },
  {
    id: "py-fund-07",
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Dictionaries and Sets",
    description: "Check whether the array contains duplicate values.",
    inputOutput: "Return True if any value appears at least twice, otherwise False.",
    constraints: ["1 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    examples: [
      { input: "nums = [1, 2, 3, 1]", output: "True", explanation: "1 appears twice." },
      { input: "nums = [1, 2, 3, 4]", output: "False", explanation: "All values are unique." }
    ],
    starterCode: "def contains_duplicate(nums):\n    pass\n",
    publicTests: [
      { input: "nums = [1, 2, 3, 1]", expected: "True", description: "Encountered duplicate" },
      { input: "nums = [1, 2, 3, 4]", expected: "False", description: "No duplicate" }
    ],
    referenceSolution: `def contains_duplicate(nums):\n    seen = set()\n    for value in nums:\n        if value in seen:\n            return True\n        seen.add(value)\n    return False\n`,
    explanation: "A set remembers which values have already been seen. The moment you see a repeated value, return True.",
    expectedTime: "O(n)",
    expectedSpace: "O(n)",
    hints: [
      "Set membership is near constant time.",
      "If a number is already in the set, you have a duplicate.",
      "Add each first-seen value to the set."
    ]
  },
  {
    id: "py-fund-08",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Strings and Arrays",
    description: "Return a new array where each element is the product of all other elements in the input.",
    inputOutput: "Return an array of products excluding each index.",
    constraints: ["2 <= len(nums) <= 2 * 10^5", "-10 <= nums[i] <= 10"],
    examples: [
      { input: "nums = [1, 2, 3, 4]", output: "[24, 12, 8, 6]", explanation: "Each result excludes the local index." },
      { input: "nums = [-1, 1, 0, -3, 3]", output: "[0, 0, 9, 0, 0]", explanation: "Zero values create a product of zero for all non-zero elements." }
    ],
    starterCode: "def product_except_self(nums):\n    pass\n",
    publicTests: [
      { input: "nums = [1, 2, 3, 4]", expected: "[24, 12, 8, 6]", description: "Positive sequence" },
      { input: "nums = [-1, 1, 0, -3, 3]", expected: "[0, 0, 9, 0, 0]", description: "Zero product" }
    ],
    referenceSolution: `def product_except_self(nums):\n    length = len(nums)\n    result = [1] * length\n    prefix = 1\n    for i in range(length):\n        result[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(length - 1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n    return result\n`,
    explanation: "Multiply prefix and suffix products to compute each output without dividing.",
    expectedTime: "O(n)",
    expectedSpace: "O(n)",
    hints: [
      "Build both left and right running products.",
      "The output at index i is prefix[i] * suffix[i].",
      "This avoids repeatedly multiplying the whole array."
    ]
  },
  {
    id: "py-fund-09",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "Dictionaries and Sets",
    description: "Return the k most frequent values from an array.",
    inputOutput: "Return a list of top k values sorted by frequency, with ties resolved by any order.",
    constraints: ["1 <= k <= len(nums)", "1 <= len(nums) <= 10^5"],
    examples: [
      { input: "nums = [1, 1, 1, 2, 2, 3], k = 2", output: "[1, 2]", explanation: "1 appears three times and is the most frequent." },
      { input: "nums = [4, 1, -1, 2, -1, 2, 3], k = 2", output: "[-1, 2]", explanation: "Both values appear twice." }
    ],
    starterCode: "def top_k_frequent(nums, k):\n    pass\n",
    publicTests: [
      { input: "nums = [1, 1, 1, 2, 2, 3], k = 2", expected: "[1, 2]", description: "Top frequencies" },
      { input: "nums = [4, 1, -1, 2, -1, 2, 3], k = 2", expected: "[-1, 2]", description: "Tied counts" }
    ],
    referenceSolution: `def top_k_frequent(nums, k):\n    counts = {}\n    for value in nums:\n        counts[value] = counts.get(value, 0) + 1\n    return [value for value, _ in sorted(counts.items(), key=lambda item: item[1], reverse=True)[:k]]\n`,
    explanation: "Count frequencies with a dictionary, then sort by count descending and select the top k values.",
    expectedTime: "O(n log n)",
    expectedSpace: "O(n)",
    hints: [
      "Use a frequency map first.",
      "Sort by count descending.",
      "Then choose the first k values."
    ]
  },
  {
    id: "py-fund-10",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Sorting and Searching",
    description: "Search for a target value in a sorted array using binary search.",
    inputOutput: "Return the index of the target if found; otherwise return -1.",
    constraints: ["The array is sorted in ascending order.", "0 <= len(nums) <= 10^5"],
    examples: [
      { input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4", explanation: "9 is found at index 4." },
      { input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1", explanation: "2 is not in the array." }
    ],
    starterCode: "def binary_search(nums, target):\n    pass\n",
    publicTests: [
      { input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", expected: "4", description: "Found target" },
      { input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", expected: "-1", description: "Target missing" }
    ],
    referenceSolution: `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n`,
    explanation: "Narrow the search interval by half at each step using the sorted property of the array.",
    expectedTime: "O(log n)",
    expectedSpace: "O(1)",
    hints: [
      "Work with a left and right pointer.",
      "Compute the midpoint and compare it to the target.",
      "Discard half the search interval each time."
    ]
  },
  {
    id: "py-fund-11",
    title: "Permutations",
    difficulty: "Medium",
    topic: "Recursion",
    description: "Generate all unique permutations of a list of distinct integers.",
    inputOutput: "Return a list of all permutations.",
    constraints: ["1 <= len(nums) <= 8", "The integers are distinct."],
    examples: [
      { input: "nums = [1, 2, 3]", output: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]", explanation: "All possible orders of the numbers are produced." },
      { input: "nums = [0]", output: "[[0]]", explanation: "Only one permutation exists." }
    ],
    starterCode: "def permute(nums):\n    pass\n",
    publicTests: [
      { input: "nums = [1, 2, 3]", expected: "6 permutations", description: "Generate all permutations" },
      { input: "nums = [0]", expected: "[[0]]", description: "Single value" }
    ],
    referenceSolution: `def permute(nums):\n    result = []\n    def backtrack(current):\n        if len(current) == len(nums):\n            result.append(current.copy())\n            return\n        for num in nums:\n            if num in current:\n                continue\n            current.append(num)\n            backtrack(current)\n            current.pop()\n    backtrack([])\n    return result\n`,
    explanation: "Recursive backtracking builds each permutation one element at a time and reverts the choice when it recurses back.",
    expectedTime: "O(n!)",
    expectedSpace: "O(n)",
    hints: [
      "Use backtracking.",
      "Keep track of used values.",
      "Recurse by appending one value at a time."
    ]
  },
  {
    id: "py-fund-12",
    title: "Max Subarray",
    difficulty: "Medium",
    topic: "Basic Dynamic Programming",
    description: "Find the contiguous subarray with the largest sum.",
    inputOutput: "Return the maximum possible sum.",
    constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    examples: [
      { input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6", explanation: "The subarray [4, -1, 2, 1] sums to 6." },
      { input: "nums = [1]", output: "1", explanation: "Single element case." }
    ],
    starterCode: "def max_subarray(nums):\n    pass\n",
    publicTests: [
      { input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", expected: "6", description: "Largest sum" },
      { input: "nums = [1]", expected: "1", description: "Single element" }
    ],
    referenceSolution: `def max_subarray(nums):\n    current = best = nums[0]\n    for value in nums[1:]:\n        current = max(value, current + value)\n        best = max(best, current)\n    return best\n`,
    explanation: "Keep the best local subarray ending at each index and update the overall maximum as you traverse the list.",
    expectedTime: "O(n)",
    expectedSpace: "O(1)",
    hints: [
      "Use Kadane's algorithm.",
      "Either extend the previous best or start fresh at the current index.",
      "Track both the current and all-time best sums."
    ]
  },
  {
    id: "py-fund-13",
    title: "House Robber",
    difficulty: "Medium",
    topic: "Basic Dynamic Programming",
    description: "Maximize the total value stolen without robbing adjacent houses.",
    inputOutput: "Return the maximum possible stolen amount.",
    constraints: ["0 <= len(nums) <= 10^5", "0 <= nums[i] <= 10^4"],
    examples: [
      { input: "nums = [1, 2, 3, 1]", output: "4", explanation: "Rob houses 2 and 4 for value 3 + 1 = 4." },
      { input: "nums = [2, 7, 9, 3, 1]", output: "12", explanation: "Rob 2, 9, and 1 for a total of 12." }
    ],
    starterCode: "def house_robber(nums):\n    pass\n",
    publicTests: [
      { input: "nums = [1, 2, 3, 1]", expected: "4", description: "Classic house robber" },
      { input: "nums = [2, 7, 9, 3, 1]", expected: "12", description: "Best non-adjacent sum" }
    ],
    referenceSolution: `def house_robber(nums):\n    if not nums:\n        return 0\n    prev_two = 0\n    prev_one = 0\n    for value in nums:\n        current = max(prev_one, prev_two + value)\n        prev_two = prev_one\n        prev_one = current\n    return prev_one\n`,
    explanation: "At each house, decide whether to skip or take the current value based on the best result from the previous two houses.",
    expectedTime: "O(n)",
    expectedSpace: "O(1)",
    hints: [
      "DP state depends on the previous two decisions.",
      "Max profit for the current house is either previous best or previous-two + current value.",
      "Keep constant memory by rolling the DP state."
    ]
  },
  {
    id: "py-fund-14",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    topic: "Sliding Window",
    description: "Find the smallest substring containing all required characters from a pattern.",
    inputOutput: "Return the smallest covering window, or an empty string if none exists.",
    constraints: ["1 <= len(s), len(t) <= 10^5", "s and t contain English letters and spaces."],
    examples: [
      { input: "s = 'ADOBECODEBANC', t = 'ABC'", output: "'BANC'", explanation: "BANC contains ABC in order with minimal length." },
      { input: "s = 'a', t = 'aa'", output: "''", explanation: "The pattern cannot be formed." }
    ],
    starterCode: "def min_window(s, t):\n    pass\n",
    publicTests: [
      { input: "s = 'ADOBECODEBANC', t = 'ABC'", expected: "BANC", description: "Smallest valid window" },
      { input: "s = 'a', t = 'aa'", expected: "", description: "Impossible pattern" }
    ],
    referenceSolution: `def min_window(s, t):\n    if not t or not s:\n        return ''\n    need = {}\n    for ch in t:\n        need[ch] = need.get(ch, 0) + 1\n    missing = len(t)\n    left = 0\n    best = ''\n    for right, ch in enumerate(s):\n        if ch in need:\n            if need[ch] > 0:\n                missing -= 1\n            need[ch] -= 1\n        while missing == 0:\n            candidate = s[left:right + 1]\n            if not best or len(candidate) < len(best):\n                best = candidate\n            left_ch = s[left]\n            if left_ch in need:\n                need[left_ch] += 1\n                if need[left_ch] > 0:\n                    missing += 1\n            left += 1\n    return best\n`,
    explanation: "Use a sliding window and a frequency counter to maintain the minimum valid window while shrinking and expanding the bounds.",
    expectedTime: "O(n)",
    expectedSpace: "O(k)",
    hints: [
      "Track how many characters from t are still missing.",
      "Expand the right end and shrink the left end.",
      "Keep only the smallest valid substring seen so far."
    ]
  },
  {
    id: "sql-01",
    title: "Customer Order Summary",
    difficulty: "Easy",
    topic: "SQL and Data Manipulation",
    description: "Write a query that returns each customer's total spend and order count from a sales table.",
    inputOutput: "Return columns: customer_id, total_spend, order_count.",
    constraints: ["Use SUM and COUNT with GROUP BY.", "Prices are stored as decimals."],
    examples: [
      { input: "orders (order_id, customer_id, amount)", output: "customer_id | total_spend | order_count", explanation: "Aggregate per customer." },
      { input: "orders with multiple rows per customer", output: "One row per customer", explanation: "Group by customer." }
    ],
    starterCode: "SELECT customer_id,\n       SUM(amount) AS total_spend,\n       COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;",
    publicTests: [
      { input: "Customer sales data", expected: "Aggregated totals", description: "Aggregation" },
      { input: "Multiple customers", expected: "One row per customer", description: "Grouping" }
    ],
    referenceSolution: `SELECT customer_id,\n       SUM(amount) AS total_spend,\n       COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id\nORDER BY customer_id;`,
    explanation: "Aggregate the data per customer using GROUP BY, then compute sums and counts for each group.",
    expectedTime: "O(n)",
    expectedSpace: "O(k)",
    hints: [
      "Group by customer_id.",
      "Use SUM(amount) and COUNT(*).",
      "Order the result to make it easier to inspect."
    ]
  },
  {
    id: "sql-02",
    title: "Top Selling Products",
    difficulty: "Medium",
    topic: "SQL and Data Manipulation",
    description: "Find the products with the highest total revenue in the last quarter.",
    inputOutput: "Return product_id, product_name, revenue.",
    constraints: ["Use a date filter and aggregate sales by product.", "Revenue is total sold quantity times unit price."],
    examples: [
      { input: "sales table with product_id, sold_at, quantity, unit_price", output: "Revenue by product", explanation: "Aggregate by product and date range." },
      { input: "Date filtered to quarter", output: "Relevant rows only", explanation: "Restrict records to the selected period." }
    ],
    starterCode: "SELECT p.product_id, p.product_name, SUM(s.quantity * s.unit_price) AS revenue\nFROM products p\nJOIN sales s ON s.product_id = p.product_id\nWHERE s.sold_at >= CURRENT_DATE - INTERVAL '90 days'\nGROUP BY p.product_id, p.product_name\nORDER BY revenue DESC;",
    publicTests: [
      { input: "Quarterly sales data", expected: "Top products by revenue", description: "Revenue aggregation" },
      { input: "Date boundary checks", expected: "Only relevant rows", description: "Range filter" }
    ],
    referenceSolution: `SELECT p.product_id,\n       p.product_name,\n       SUM(s.quantity * s.unit_price) AS revenue\nFROM products p\nJOIN sales s ON p.product_id = s.product_id\nWHERE s.sold_at >= DATE_TRUNC('quarter', CURRENT_DATE)\nGROUP BY p.product_id, p.product_name\nORDER BY revenue DESC;`,
    explanation: "Join the product and sales tables, filter for the target time window, and aggregate revenue by product.",
    expectedTime: "O(n)",
    expectedSpace: "O(k)",
    hints: [
      "Use a JOIN on product_id.",
      "Filter to the date range first.",
      "Summarize revenue with GROUP BY."
    ]
  },
  {
    id: "sql-03",
    title: "Duplicate Customer Detection",
    difficulty: "Easy",
    topic: "SQL and Data Manipulation",
    description: "Identify duplicate email addresses in a customer table.",
    inputOutput: "Return email and the number of times it appears.",
    constraints: ["Use GROUP BY and HAVING.", "The table has one row per customer."],
    examples: [
      { input: "customers (id, email)", output: "duplicate emails with counts", explanation: "Show email addresses that repeat." },
      { input: "No duplicates", output: "No rows", explanation: "HAVING filters empty results." }
    ],
    starterCode: "SELECT email, COUNT(*) AS duplicates\nFROM customers\nGROUP BY email\nHAVING COUNT(*) > 1;",
    publicTests: [
      { input: "Customers with repeated emails", expected: "Duplicate emails only", description: "Group and filter" },
      { input: "Unique email set", expected: "Empty result", description: "No duplicates" }
    ],
    referenceSolution: `SELECT email, COUNT(*) AS duplicate_count\nFROM customers\nGROUP BY email\nHAVING COUNT(*) > 1;`,
    explanation: "Group by email and filter with HAVING to keep only repeated values.",
    expectedTime: "O(n)",
    expectedSpace: "O(k)",
    hints: [
      "Group by email.",
      "Use HAVING COUNT(*) > 1.",
      "Return the count and the email value."
    ]
  },
  {
    id: "sql-04",
    title: "Customer Retention Window",
    difficulty: "Medium",
    topic: "SQL and Data Manipulation",
    description: "Find the number of customers who made purchases in both the current and previous month.",
    inputOutput: "Return the retained customer count.",
    constraints: ["Use self-join or a date comparison on a sales table.", "Keep logic inclusive of both months."],
    examples: [
      { input: "orders with customer_id and order_date", output: "retention_count", explanation: "Count customers appearing in both windows." },
      { input: "No overlap", output: "0", explanation: "No retained customers." }
    ],
    starterCode: "SELECT COUNT(DISTINCT current.customer_id) AS retained_customers\nFROM orders current\nJOIN orders previous ON current.customer_id = previous.customer_id\nWHERE current.order_date >= DATE_TRUNC('month', CURRENT_DATE)\n  AND previous.order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')\n  AND previous.order_date < DATE_TRUNC('month', CURRENT_DATE);",
    publicTests: [
      { input: "Customer ordering across months", expected: "Retained count", description: "Overlap logic" },
      { input: "No duplicated ordering", expected: "Zero", description: "No retention" }
    ],
    referenceSolution: `SELECT COUNT(DISTINCT current.customer_id) AS retained_customers\nFROM orders current\nJOIN orders previous ON current.customer_id = previous.customer_id\nWHERE current.order_date >= DATE_TRUNC('month', CURRENT_DATE)\n  AND previous.order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')\n  AND previous.order_date < DATE_TRUNC('month', CURRENT_DATE);`,
    explanation: "Join the same orders table to itself, then compare customer activity between consecutive monthly windows.",
    expectedTime: "O(n)",
    expectedSpace: "O(k)",
    hints: [
      "Use a self-join on customer_id.",
      "Compare months with date filters.",
      "Remove duplicates with DISTINCT."
    ]
  },
  {
    id: "sql-05",
    title: "One-to-Many Revenue by Category",
    difficulty: "Hard",
    topic: "SQL and Data Manipulation",
    description: "Return each category's total revenue and average order size using joined tables.",
    inputOutput: "Return category, total_revenue, average_order_value.",
    constraints: ["Use joins, grouping, and AVG.", "A category can have many products and orders."],
    examples: [
      { input: "categories, products, orders", output: "Category aggregates", explanation: "Summarize across tables." },
      { input: "varied order sizes", output: "Averages per category", explanation: "Average order value reflects aggregate data." }
    ],
    starterCode: "SELECT c.name AS category,\n       SUM(oi.quantity * oi.price) AS total_revenue,\n       AVG(oi.quantity * oi.price) AS average_order_value\nFROM categories c\nJOIN products p ON p.category_id = c.id\nJOIN order_items oi ON oi.product_id = p.id\nGROUP BY c.name;",
    publicTests: [
      { input: "Category and order tables", expected: "Group by category", description: "Data aggregation" },
      { input: "Mismatched products", expected: "Join correctness", description: "Join semantics" }
    ],
    referenceSolution: `SELECT c.name AS category,\n       SUM(oi.quantity * oi.price) AS total_revenue,\n       AVG(oi.quantity * oi.price) AS average_order_value\nFROM categories c\nJOIN products p ON p.category_id = c.id\nJOIN order_items oi ON oi.product_id = p.id\nGROUP BY c.name\nORDER BY total_revenue DESC;`,
    explanation: "Join the category, product, and order item tables, then aggregate total revenue and average order value per category.",
    expectedTime: "O(n)",
    expectedSpace: "O(k)",
    hints: [
      "Start with the JOIN chain.",
      "Aggregate revenue and average order values.",
      "Group by category name."
    ]
  },
  {
    id: "ai-01",
    title: "ETL Pipeline Design",
    difficulty: "Medium",
    topic: "AI / Data Engineering Fundamentals",
    description: "Design an ETL pipeline that ingests raw customer data, validates it, transforms it, and stores it for analytics.",
    inputOutput: "Provide a concise design with data flow, validation rules, and storage decisions.",
    constraints: ["Keep the design resilient to bad rows and schema drift.", "Include quality checks and monitoring."],
    examples: [
      { input: "CSV or JSON input from a webhook", output: "Validation + transform + warehouse load", explanation: "Typical ETL lifecycle." },
      { input: "Bad or missing data", output: "Quarantine and alert", explanation: "Data quality matters." }
    ],
    starterCode: "# Describe your pipeline design\n# 1. Ingest\n# 2. Validate\n# 3. Transform\n# 4. Load\n",
    publicTests: [
      { input: "Data engineering scenario", expected: "Pipeline design structure", description: "Architecture response" },
      { input: "Quality guardrails", expected: "Mention validation and monitoring", description: "Operational considerations" }
    ],
    referenceSolution: `# Ingestion: collect raw files or events from S3 / APIs\n# Validation: schema checks, null handling, reject malformed records\n# Transform: normalize types, standardize names, deduplicate keys\n# Load: write to warehouse tables and partitioned storage\n# Monitoring: track throughput, data quality, failed rows, latency\n`,
    explanation: "Real ETL pipelines separate ingestion, validation, transformation, and loading while adding observability and error handling.",
    expectedTime: "N/A",
    expectedSpace: "N/A",
    hints: [
      "Start with raw ingestion and schema enforcement.",
      "Quarantine bad rows before they reach the warehouse.",
      "Add monitoring such as row counts and invalid-record alerts."
    ]
  },
  {
    id: "ai-02",
    title: "Prompt Engineering for Code Review",
    difficulty: "Easy",
    topic: "AI / Data Engineering Fundamentals",
    description: "Write a concise prompt that asks an LLM to review a Python function for correctness, edge cases, and complexity without giving away the answer.",
    inputOutput: "Return a well-structured prompt template.",
    constraints: ["Keep the task grounded in the code and objective.", "Ask for actionable suggestions rather than a full rewrite."],
    examples: [
      { input: "Function under review", output: "Prompt with context and constraints", explanation: "Prompt should be clear and bounded." },
      { input: "Edge cases desired", output: "Checklist for reasoning", explanation: "A good prompt requests analysis, not just a verdict." }
    ],
    starterCode: "system_prompt = 'Review the function for correctness, edge cases, complexity, and readability.'\nuser_prompt = 'Here is the code to review: {code}'\n",
    publicTests: [
      { input: "Code review prompt", expected: "Context + constraints + output request", description: "Prompt structure" },
      { input: "No answer leakage", expected: "Feedback tone", description: "Bounded instruction" }
    ],
    referenceSolution: `SYSTEM = "You are a careful software reviewer. Review the code for correctness, edge cases, complexity, readability, and maintainability. Do not rewrite the function unless asked."\nUSER = "Here is the Python function and the expected behavior: {description} {code}"\nOUTPUT = "Provide: (1) correctness, (2) edge cases, (3) complexity, (4) suggested improvements."`,
    explanation: "Good prompts specify the role, task, constraints, and output shape so the model returns structured, actionable feedback.",
    expectedTime: "N/A",
    expectedSpace: "N/A",
    hints: [
      "Give the model a role and a clear task.",
      "List the dimensions you care about.",
      "Request patterns, not a wholesale rewrite."
    ]
  },
  {
    id: "ai-03",
    title: "Feature Store Design",
    difficulty: "Medium",
    topic: "AI / Data Engineering Fundamentals",
    description: "Design a feature store for offline training and online prediction in a model serving system.",
    inputOutput: "Describe the data flow and feature types with a short architecture summary.",
    constraints: ["Support training and inference pipelines.", "Keep feature definitions versioned and reproducible."],
    examples: [
      { input: "Customer retention model", output: "Online and offline features", explanation: "Feature store feeds both training and serving." },
      { input: "Feature drift", output: "Versioning + monitoring", explanation: "Versioned features keep models consistent." }
    ],
    starterCode: "# Design a feature store for training and inference\n",
    publicTests: [
      { input: "Feature store scenario", expected: "Offline + online feature support", description: "Architecture" },
      { input: "Reproducibility concerns", expected: "Versioning and monitoring", description: "Operational design" }
    ],
    referenceSolution: `# 1. Define feature schemas and versions\n# 2. Backfill features for offline training\n# 3. Serve low-latency online features for inference\n# 4. Join features to labels and events\n# 5. Monitor drift, freshness, and null-rate\n`,
    explanation: "A feature store centralizes feature definitions so both training and serving use the same logic and schema versions.",
    expectedTime: "N/A",
    expectedSpace: "N/A",
    hints: [
      "Separate offline and online paths.",
      "Version the feature definition and freshness checks.",
      "Monitor drift and stale data."
    ]
  },
  {
    id: "ai-04",
    title: "Data Quality Checks",
    difficulty: "Easy",
    topic: "AI / Data Engineering Fundamentals",
    description: "List the main data quality checks for a pipeline that ingests user events into a warehouse.",
    inputOutput: "Return a bullet list of quality checks and what they catch.",
    constraints: ["Focus on practical checks used in production pipelines.", "Include missing, invalid, and duplicate data rules."],
    examples: [
      { input: "User event table", output: "null checks, duplicate checks, range checks", explanation: "Quality checks prevent bad analytics." },
      { input: "Broken timestamp values", output: "Validation alert", explanation: "Bad timestamps are a common data issue." }
    ],
    starterCode: "# List data quality checks\n",
    publicTests: [
      { input: "Pipeline quality checks", expected: "Missing + duplicates + schema checks", description: "Quality rubric" },
      { input: "Operational artifact", expected: "Actionable checks", description: "Business impact" }
    ],
    referenceSolution: `# Null checks: ensure required fields are not empty\n# Duplicate checks: detect repeated rows or IDs\n# Type checks: validate strings, numbers, dates\n# Range checks: ensure values match expected domains\n# Freshness checks: confirm arrivals are within SLA\n`,
    explanation: "Production-grade data quality checks keep metrics trustworthy by preventing bad records from propagating downstream.",
    expectedTime: "N/A",
    expectedSpace: "N/A",
    hints: [
      "Check required fields.",
      "Look for duplicates and schema mismatches.",
      "Monitor freshness and thresholds."
    ]
  },
  {
    id: "ai-05",
    title: "Model Evaluation Metrics",
    difficulty: "Medium",
    topic: "AI / Data Engineering Fundamentals",
    description: "Describe which evaluation metrics matter when assessing a classification model for imbalanced data.",
    inputOutput: "Provide a short explanation of precision, recall, F1, and AUC with notes on class imbalance.",
    constraints: ["Do not assume balanced classes.", "Mention at least one business tradeoff."],
    examples: [
      { input: "Fraud detection dataset", output: "Precision/recall tradeoff and class imbalance", explanation: "A rare-positive problem usually needs recall-first thinking." },
      { input: "Balanced dataset", output: "Accuracy may be informative", explanation: "Balance matters when class distribution is even." }
    ],
    starterCode: "# Discuss metrics for imbalanced classification\n",
    publicTests: [
      { input: "Class imbalance scenario", expected: "Precision and recall discussion", description: "Metric choice" },
      { input: "Business tradeoff", expected: "Mention balance or thresholding", description: "Operational nuance" }
    ],
    referenceSolution: `# Accuracy can be misleading under class imbalance\n# Precision measures false positives; recall measures false negatives\n# F1 balances precision and recall\n# AUC summarizes ranking quality across thresholds\n# Choose metrics based on the business cost of false alarms vs missed detections\n`,
    explanation: "When classes are imbalanced, aggregate metrics like accuracy can hide problems; precision, recall, F1, and AUC provide more useful signals.",
    expectedTime: "N/A",
    expectedSpace: "N/A",
    hints: [
      "Accuracy is often misleading in imbalanced tasks.",
      "Model tuning depends on business cost rather than one metric alone.",
      "Review precision and recall together."
    ]
  }
];

export const questionMap = Object.fromEntries(questions.map((question) => [question.id, question]));

export const questionTopics = [...new Set(questions.map((question) => question.topic))];
export const difficulties = [...new Set(questions.map((question) => question.difficulty))];
