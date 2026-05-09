export const defaultLocale = "en";
export const locales = ["en", "ko", "ja", "zh-cn", "zh-tw"] as const;

export type Locale = (typeof locales)[number];

export function getLocale(locale?: string): Locale {
	return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

export function localizedPath(locale: Locale, path = "/") {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;

	if (locale === defaultLocale) {
		return normalizedPath;
	}

	if (normalizedPath === "/") {
		return `/${locale}`;
	}

	return `/${locale}${normalizedPath}`;
}

export function blogSlug(id: string, locale: Locale) {
	return id
		.replace(new RegExp(`^${locale}/`), "")
		.replace(new RegExp(`/${locale}$`), "")
		.replace(/\/index$/, "");
}

export function isLocaleEntry(id: string, locale: Locale) {
	return id.startsWith(`${locale}/`) || id.endsWith(`/${locale}`);
}

export const ui = {
	en: {
		meta: {
			defaultTitle: "Synch - Open-source E2EE sync for Obsidian",
			defaultDescription:
				"An open-source alternative to Obsidian Sync. Your notes are encrypted locally before leaving your device, ensuring complete privacy and control over your data.",
			pricingTitle: "Pricing - Synch",
			pricingDescription: "Compare Synch plans and storage limits for end-to-end encrypted Obsidian vault sync.",
			blogTitle: "Blog - Synch",
			blogDescription: "Articles about end-to-end encrypted Obsidian sync, privacy, and Synch development.",
			billingTitle: "Billing - Synch",
			billingDescription: "Manage your Synch subscription and billing settings.",
			billingSuccessTitle: "Confirming subscription - Synch",
			billingSuccessDescription: "Confirming your Synch subscription and applying it to your account.",
		},
		nav: {
			pricing: "Pricing",
			github: "GitHub",
			signIn: "Sign In",
			signUp: "Sign Up",
			vaults: "Vaults",
			blog: "Blog",
			terms: "Terms",
			privacy: "Privacy",
		},
		home: {
			heroTitle: ["End-to-end encrypted sync", "for Obsidian."],
			featuredTitle: "Learn more",
			featuredPosts: [
				{
					title: "How does Synch's end-to-end encryption work?",
					body: "A plain-English walkthrough of how Synch encrypts vault data, protects the vault key, and unlocks encrypted data on another device.",
					href: "/blog/encryption-and-decryption"
				}
			],
			heroBody:
				"An open-source alternative to Obsidian Sync. Your notes are encrypted locally before leaving your device, ensuring complete privacy and control over your data.",
			getStarted: "Get Started",
			viewSource: "View Source",
			features: [
				{
					title: "Zero Knowledge",
					body: "Everything is encrypted with AES-256-GCM on your device. The server never sees your raw notes.",
				},
				{
					title: "Open Source",
					body: "Built in the open. You can inspect the code, host it yourself, or contribute to the project on GitHub.",
				},
			],
			installTitle: "How to Install",
			installIntroBefore: "The Synch plugin is currently in early development and can be installed via the",
			installIntroAfter: "plugin.",
			installSteps: [
				["Open Obsidian Settings and go to", "Community plugins", "."],
				["Turn off Safe mode and click", "Browse", "."],
				["Search for and install", "BRAT", ", then enable it."],
				["Open the BRAT settings, and click", "Add Beta plugin", "."],
				["Enter the repository URL:"],
				["Go back to Community plugins and enable", "Synch", "."],
			],
			addRepositorySuffix: "and add it.",
			copyTitle: "Copy to clipboard",
			selfHosting: {
				title: "Use your own Synch server",
				body: "Create a Synch server on a free Cloudflare account and paste its address into the Obsidian plugin. The guide walks through the setup step by step.",
				link: "Read the self-hosting guide",
			},
		},
		pricing: {
			heading: "Simple, transparent pricing.",
			subheading: "Start syncing your vaults for free.",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			forever: "/ forever",
			month: "/ month",
			year: "/ year",
			monthly: "Monthly",
			annual: "Annual",
			earlyAccessBadge: "Early adopter",
			comingSoon: "Coming Soon",
			features: {
				oneVault: "1 synced vault",
				freeStorage: "50 MB storage",
				starterStorage: "1 GB storage",
				freeFileSize: "3 MB max file size",
				starterFileSize: "5 MB max file size",
				freeHistory: "1 day version history",
				starterHistory: "1 month version history",
			},
		},
		blog: {
			heading: "Blog",
			empty: "No blog posts have been added yet.",
			dateLocale: "en",
		},
		billing: {
			heading: "Confirming subscription",
			message: "Your subscription is being applied. This usually takes a few seconds.",
			continue: "Continue to vaults",
			fallback: "Still waiting for payment confirmation. You can continue and refresh later.",
		},
		billingSettings: {
			eyebrow: "Billing",
			heading: "Manage subscription",
			subheading: "View your current plan and open the billing portal to change or cancel your subscription.",
			loading: "Loading billing status...",
			currentPlan: "Current plan",
			renewal: "Renewal",
			endsOn: "Ends on",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			monthly: "Monthly",
			annual: "Annual",
			freeInterval: "Free",
			canceling: "Canceling",
			canceled: "Canceled",
			noRenewalDate: "No renewal scheduled",
			activeMessage: "Your subscription is active. Open the billing portal to change your plan, cancel, or update payment details.",
			cancelingMessage: "Your subscription is set to cancel at the end of the current billing period.",
			canceledMessage: "Your subscription has been canceled. Your current plan is free.",
			freeMessage: "You are currently on the free plan. Upgrade when you need more storage.",
			manage: "Manage subscription",
			upgrade: "View plans",
			authRequired: "Sign in to view and manage your subscription.",
			signIn: "Sign in",
			error: "Billing information could not be loaded. Try again in a moment.",
			retry: "Retry",
		},
	},
	ko: {
		meta: {
			defaultTitle: "Synch - Obsidian용 오픈소스 종단 간 암호화 동기화",
			defaultDescription:
				"Obsidian Sync를 대체할 수 있는 오픈소스 동기화 서비스입니다. 노트는 기기 안에서 먼저 암호화된 뒤 전송되므로, 내 데이터는 내가 안전하게 관리할 수 있습니다.",
			pricingTitle: "요금제 - Synch",
			pricingDescription: "종단 간 암호화 Obsidian vault 동기화를 위한 Synch 요금제와 저장 용량을 비교하세요.",
			blogTitle: "블로그 - Synch",
			blogDescription: "종단 간 암호화 Obsidian 동기화, 개인정보 보호, Synch 개발에 관한 글을 읽어보세요.",
			billingTitle: "구독 관리 - Synch",
			billingDescription: "Synch 구독과 결제 설정을 관리하세요.",
			billingSuccessTitle: "구독 확인 중 - Synch",
			billingSuccessDescription: "Synch 구독을 확인하고 계정에 적용하는 중입니다.",
		},
		nav: {
			pricing: "요금제",
			github: "GitHub",
			signIn: "로그인",
			signUp: "가입하기",
			vaults: "Vaults",
			blog: "블로그",
			terms: "이용약관",
			privacy: "개인정보 처리방침",
		},
		home: {
			heroTitle: ["Obsidian을 위한", "종단간 암호화 동기화."],
			featuredTitle: "더 알아보기",
			featuredPosts: [
				{
					title: "Synch의 종단 간 암호화는 어떻게 작동할까요?",
					body: "Synch가 어떻게 데이터를 암호화하고, 키를 보호하며, 다른 기기에서 안전하게 데이터를 여는지 알기 쉽게 설명합니다.",
					href: "/blog/encryption-and-decryption"
				}
			],
			heroBody:
				"Obsidian Sync를 대체할 수 있는 오픈소스 동기화 서비스입니다. 노트는 기기 안에서 먼저 암호화된 뒤 전송되므로, 내 데이터는 내가 안전하게 관리할 수 있습니다.",
			getStarted: "시작하기",
			viewSource: "소스 보기",
			features: [
				{
					title: "서버도 볼 수 없는 암호화",
					body: "모든 데이터는 내 기기에서 AES-256-GCM으로 암호화됩니다. 서버에는 암호화된 내용만 저장되고, 원본 노트는 전달되지 않습니다.",
				},
				{
					title: "오픈소스",
					body: "개발 과정과 코드가 모두 공개되어 있습니다. 코드를 직접 확인하고, 직접 호스팅하거나, GitHub에서 프로젝트에 참여할 수 있습니다.",
				},
			],
			installTitle: "설치 방법",
			installIntroBefore: "Synch 플러그인은 아직 초기 개발 단계라",
			installIntroAfter: "플러그인을 통해 설치할 수 있습니다.",
			installSteps: [
				["Obsidian 설정을 열고", "Community plugins", "로 이동합니다."],
				["Safe mode를 끄고", "Browse", "를 클릭합니다."],
				["", "BRAT", "을 검색해 설치한 다음 활성화합니다."],
				["BRAT 설정을 열고", "Add Beta plugin", "을 클릭합니다."],
				["저장소 URL을 입력합니다:"],
				["Community plugins로 돌아가", "Synch", "를 활성화합니다."],
			],
			addRepositorySuffix: "입력한 뒤 추가합니다.",
			copyTitle: "클립보드에 복사",
			selfHosting: {
				title: "내 Synch 서버 사용하기",
				body: "Cloudflare 무료 계정에 Synch 서버를 만들고, 그 주소를 Obsidian 플러그인에 넣어 사용할 수 있습니다. 가이드에서 설정 과정을 차근차근 안내합니다.",
				link: "셀프 호스팅 가이드 보기",
			},
		},
		pricing: {
			heading: "간단하고 투명한 요금제.",
			subheading: "무료로 vault 동기화를 시작하세요.",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			forever: "/ 평생 무료",
			month: "/ 월",
			year: "/ 년",
			monthly: "월간",
			annual: "연간",
			earlyAccessBadge: "얼리어답터 한정",
			comingSoon: "준비 중",
			features: {
				oneVault: "vault 1개 동기화",
				freeStorage: "저장 공간 50 MB",
				starterStorage: "저장 공간 1 GB",
				freeFileSize: "파일당 최대 3 MB",
				starterFileSize: "파일당 최대 5 MB",
				freeHistory: "버전 기록 1일",
				starterHistory: "버전 기록 1개월",
			},
		},
		blog: {
			heading: "블로그",
			empty: "아직 블로그 글이 없습니다.",
			dateLocale: "ko-KR",
		},
		billing: {
			heading: "구독 확인 중",
			message: "구독 정보를 적용하고 있습니다. 보통 몇 초 안에 완료됩니다.",
			continue: "Vaults로 이동",
			fallback: "아직 결제 확인이 끝나지 않았습니다. 먼저 이동한 뒤 나중에 새로고침해도 됩니다.",
		},
		billingSettings: {
			eyebrow: "구독",
			heading: "구독 관리",
			subheading: "현재 요금제를 확인하고 결제 포털에서 구독을 변경하거나 취소할 수 있습니다.",
			loading: "구독 상태를 불러오는 중...",
			currentPlan: "현재 요금제",
			renewal: "갱신",
			endsOn: "종료일",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			monthly: "월간",
			annual: "연간",
			freeInterval: "무료",
			canceling: "취소 예정",
			canceled: "취소됨",
			noRenewalDate: "예정된 갱신 없음",
			activeMessage: "구독이 활성화되어 있습니다. 결제 포털에서 요금제 변경, 구독 취소, 결제수단 변경을 할 수 있습니다.",
			cancelingMessage: "현재 결제 기간이 끝나면 구독이 취소될 예정입니다.",
			canceledMessage: "구독이 취소되었습니다. 현재 요금제는 무료입니다.",
			freeMessage: "현재 무료 요금제를 사용 중입니다. 더 많은 저장 공간이 필요하면 업그레이드하세요.",
			manage: "구독 관리",
			upgrade: "요금제 보기",
			authRequired: "구독을 확인하고 관리하려면 로그인하세요.",
			signIn: "로그인",
			error: "구독 정보를 불러오지 못했습니다. 잠시 후 다시 시도하세요.",
			retry: "다시 시도",
		},
	},
	ja: {
		meta: {
			defaultTitle: "Synch - Obsidian向けオープンソースE2EE同期",
			defaultDescription:
				"Obsidian Syncのオープンソース代替です。ノートはデバイス上で暗号化されてから送信されるため、データのプライバシーと管理権を保てます。",
			pricingTitle: "料金 - Synch",
			pricingDescription: "エンドツーエンド暗号化されたObsidian vault同期向けのSynchプランと容量を比較できます。",
			blogTitle: "ブログ - Synch",
			blogDescription: "エンドツーエンド暗号化されたObsidian同期、プライバシー、Synch開発に関する記事です。",
			billingTitle: "請求 - Synch",
			billingDescription: "Synchのサブスクリプションと請求設定を管理します。",
			billingSuccessTitle: "サブスクリプション確認中 - Synch",
			billingSuccessDescription: "Synchのサブスクリプションを確認し、アカウントへ適用しています。",
		},
		nav: {
			pricing: "料金",
			github: "GitHub",
			signIn: "サインイン",
			signUp: "登録",
			vaults: "Vaults",
			blog: "ブログ",
			terms: "利用規約",
			privacy: "プライバシー",
		},
		home: {
			heroTitle: ["Obsidianのための", "エンドツーエンド暗号化同期。"],
			featuredTitle: "詳しく見る",
			featuredPosts: [
				{
					title: "Synchのエンドツーエンド暗号化はどのように動きますか?",
					body: "Synchがvaultデータを暗号化し、vault keyを保護し、別の端末で安全にデータを開く仕組みを平易に説明します。",
					href: "/blog/encryption-and-decryption"
				}
			],
			heroBody:
				"Obsidian Syncのオープンソース代替です。ノートはデバイス上で暗号化されてから送信されるため、データのプライバシーと管理権を保てます。",
			getStarted: "はじめる",
			viewSource: "ソースを見る",
			features: [
				{
					title: "ゼロ知識",
					body: "すべてのデータはデバイス上でAES-256-GCMにより暗号化されます。サーバーが生のノートを見ることはありません。",
				},
				{
					title: "オープンソース",
					body: "開かれた環境で開発されています。コードを確認し、自分でホストし、GitHubでプロジェクトに参加できます。",
				},
			],
			installTitle: "インストール方法",
			installIntroBefore: "Synchプラグインは現在初期開発中で、",
			installIntroAfter: "プラグインからインストールできます。",
			installSteps: [
				["Obsidian設定を開き", "Community plugins", "へ移動します。"],
				["Safe modeをオフにして", "Browse", "をクリックします。"],
				["", "BRAT", "を検索してインストールし、有効化します。"],
				["BRAT設定を開き", "Add Beta plugin", "をクリックします。"],
				["リポジトリURLを入力します:"],
				["Community pluginsに戻り", "Synch", "を有効化します。"],
			],
			addRepositorySuffix: "を追加します。",
			copyTitle: "クリップボードにコピー",
			selfHosting: {
				title: "自分の Synch サーバーを使う",
				body: "Cloudflare の無料アカウントに Synch サーバーを作成し、そのアドレスを Obsidian プラグインに入力できます。",
				link: "セルフホストガイドを読む",
			},
		},
		pricing: {
			heading: "シンプルで透明な料金。",
			subheading: "無料でvault同期を始められます。",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			forever: "/ 永久無料",
			month: "/ 月",
			year: "/ 年",
			monthly: "月額",
			annual: "年額",
			earlyAccessBadge: "早期ユーザー限定",
			comingSoon: "近日公開",
			features: {
				oneVault: "同期vault 1個",
				freeStorage: "50 MBストレージ",
				starterStorage: "1 GBストレージ",
				freeFileSize: "最大ファイルサイズ3 MB",
				starterFileSize: "最大ファイルサイズ5 MB",
				freeHistory: "1日分のバージョン履歴",
				starterHistory: "1か月分のバージョン履歴",
			},
		},
		blog: {
			heading: "ブログ",
			empty: "ブログ記事はまだありません。",
			dateLocale: "ja-JP",
		},
		billing: {
			heading: "サブスクリプション確認中",
			message: "サブスクリプションを適用しています。通常は数秒で完了します。",
			continue: "Vaultsへ進む",
			fallback: "支払い確認がまだ完了していません。先に進み、あとで更新できます。",
		},
		billingSettings: {
			eyebrow: "請求",
			heading: "サブスクリプション管理",
			subheading: "現在のプランを確認し、請求ポータルでプラン変更や解約ができます。",
			loading: "請求状態を読み込み中...",
			currentPlan: "現在のプラン",
			renewal: "更新",
			endsOn: "終了日",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			monthly: "月額",
			annual: "年額",
			freeInterval: "無料",
			canceling: "解約予定",
			canceled: "解約済み",
			noRenewalDate: "更新予定なし",
			activeMessage: "サブスクリプションは有効です。請求ポータルでプラン変更、解約、支払い方法の更新ができます。",
			cancelingMessage: "現在の請求期間の終了時にサブスクリプションが解約されます。",
			canceledMessage: "サブスクリプションは解約されています。現在のプランは無料です。",
			freeMessage: "現在は無料プランです。容量が必要になったらアップグレードできます。",
			manage: "サブスクリプション管理",
			upgrade: "プランを見る",
			authRequired: "サブスクリプションを表示・管理するにはサインインしてください。",
			signIn: "サインイン",
			error: "請求情報を読み込めませんでした。しばらくしてから再試行してください。",
			retry: "再試行",
		},
	},
	"zh-cn": {
		meta: {
			defaultTitle: "Synch - 面向 Obsidian 的开源端到端加密同步",
			defaultDescription:
				"Obsidian Sync 的开源替代方案。你的笔记会先在设备上加密再离开设备，确保隐私和数据控制权。",
			pricingTitle: "价格 - Synch",
			pricingDescription: "比较 Synch 面向端到端加密 Obsidian vault 同步的方案和存储限制。",
			blogTitle: "博客 - Synch",
			blogDescription: "关于端到端加密 Obsidian 同步、隐私和 Synch 开发的文章。",
			billingTitle: "账单 - Synch",
			billingDescription: "管理你的 Synch 订阅和账单设置。",
			billingSuccessTitle: "正在确认订阅 - Synch",
			billingSuccessDescription: "正在确认你的 Synch 订阅并应用到账户。",
		},
		nav: {
			pricing: "价格",
			github: "GitHub",
			signIn: "登录",
			signUp: "注册",
			vaults: "Vaults",
			blog: "博客",
			terms: "条款",
			privacy: "隐私",
		},
		home: {
			heroTitle: ["面向 Obsidian 的", "端到端加密同步。"],
			featuredTitle: "了解更多",
			featuredPosts: [
				{
					title: "Synch 的端到端加密是如何工作的？",
					body: "用通俗方式说明 Synch 如何加密 vault 数据、保护 vault key，并在另一台设备上安全打开数据。",
					href: "/blog/encryption-and-decryption"
				}
			],
			heroBody:
				"Obsidian Sync 的开源替代方案。你的笔记会先在设备上加密再离开设备，确保隐私和数据控制权。",
			getStarted: "开始使用",
			viewSource: "查看源码",
			features: [
				{
					title: "零知识",
					body: "所有数据都在你的设备上使用 AES-256-GCM 加密。服务器永远看不到原始笔记。",
				},
				{
					title: "开源",
					body: "开放构建。你可以检查代码、自行托管，或在 GitHub 上参与项目。",
				},
			],
			installTitle: "如何安装",
			installIntroBefore: "Synch 插件目前仍处于早期开发阶段，可通过",
			installIntroAfter: "插件安装。",
			installSteps: [
				["打开 Obsidian 设置并进入", "Community plugins", "。"],
				["关闭 Safe mode，然后点击", "Browse", "。"],
				["搜索并安装", "BRAT", "，然后启用它。"],
				["打开 BRAT 设置，点击", "Add Beta plugin", "。"],
				["输入仓库 URL:"],
				["返回 Community plugins 并启用", "Synch", "。"],
			],
			addRepositorySuffix: "并添加。",
			copyTitle: "复制到剪贴板",
			selfHosting: {
				title: "使用自己的 Synch 服务器",
				body: "你可以在 Cloudflare 免费账号中创建 Synch 服务器，并把它的地址填入 Obsidian 插件。",
				link: "阅读自托管指南",
			},
		},
		pricing: {
			heading: "简单透明的价格。",
			subheading: "免费开始同步你的 vault。",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			forever: "/ 永久",
			month: "/ 月",
			year: "/ 年",
			monthly: "月付",
			annual: "年付",
			earlyAccessBadge: "早期用户价",
			comingSoon: "即将推出",
			features: {
				oneVault: "1 个同步 vault",
				freeStorage: "50 MB 存储",
				starterStorage: "1 GB 存储",
				freeFileSize: "最大文件 3 MB",
				starterFileSize: "最大文件 5 MB",
				freeHistory: "1 天版本历史",
				starterHistory: "1 个月版本历史",
			},
		},
		blog: {
			heading: "博客",
			empty: "还没有博客文章。",
			dateLocale: "zh-CN",
		},
		billing: {
			heading: "正在确认订阅",
			message: "正在应用你的订阅。这通常只需要几秒钟。",
			continue: "继续前往 Vaults",
			fallback: "仍在等待付款确认。你可以先继续，稍后再刷新。",
		},
		billingSettings: {
			eyebrow: "账单",
			heading: "管理订阅",
			subheading: "查看当前方案，并打开账单门户来更改或取消订阅。",
			loading: "正在加载账单状态...",
			currentPlan: "当前方案",
			renewal: "续订",
			endsOn: "结束于",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			monthly: "月付",
			annual: "年付",
			freeInterval: "免费",
			canceling: "将取消",
			canceled: "已取消",
			noRenewalDate: "无计划续订",
			activeMessage: "你的订阅处于有效状态。可打开账单门户更改方案、取消订阅或更新付款信息。",
			cancelingMessage: "你的订阅将在当前账单周期结束时取消。",
			canceledMessage: "你的订阅已取消。当前方案为免费。",
			freeMessage: "你目前使用免费方案。需要更多存储时可以升级。",
			manage: "管理订阅",
			upgrade: "查看方案",
			authRequired: "请登录以查看和管理订阅。",
			signIn: "登录",
			error: "无法加载账单信息。请稍后重试。",
			retry: "重试",
		},
	},
	"zh-tw": {
		meta: {
			defaultTitle: "Synch - 適用於 Obsidian 的開源端對端加密同步",
			defaultDescription:
				"Obsidian Sync 的開源替代方案。你的筆記會先在裝置上加密再離開裝置，確保隱私與資料控制權。",
			pricingTitle: "價格 - Synch",
			pricingDescription: "比較 Synch 適用於端對端加密 Obsidian vault 同步的方案與儲存限制。",
			blogTitle: "部落格 - Synch",
			blogDescription: "關於端對端加密 Obsidian 同步、隱私與 Synch 開發的文章。",
			billingTitle: "帳單 - Synch",
			billingDescription: "管理你的 Synch 訂閱與帳單設定。",
			billingSuccessTitle: "正在確認訂閱 - Synch",
			billingSuccessDescription: "正在確認你的 Synch 訂閱並套用到帳戶。",
		},
		nav: {
			pricing: "價格",
			github: "GitHub",
			signIn: "登入",
			signUp: "註冊",
			vaults: "Vaults",
			blog: "部落格",
			terms: "條款",
			privacy: "隱私",
		},
		home: {
			heroTitle: ["適用於 Obsidian 的", "端對端加密同步。"],
			featuredTitle: "了解更多",
			featuredPosts: [
				{
					title: "Synch 的端對端加密是如何運作的？",
					body: "用通俗方式說明 Synch 如何加密 vault 資料、保護 vault key，並在另一台裝置上安全開啟資料。",
					href: "/blog/encryption-and-decryption"
				}
			],
			heroBody:
				"Obsidian Sync 的開源替代方案。你的筆記會先在裝置上加密再離開裝置，確保隱私與資料控制權。",
			getStarted: "開始使用",
			viewSource: "查看原始碼",
			features: [
				{
					title: "零知識",
					body: "所有資料都在你的裝置上使用 AES-256-GCM 加密。伺服器永遠看不到原始筆記。",
				},
				{
					title: "開源",
					body: "以開放方式建置。你可以檢視程式碼、自行託管，或在 GitHub 上參與專案。",
				},
			],
			installTitle: "如何安裝",
			installIntroBefore: "Synch 外掛目前仍處於早期開發階段，可透過",
			installIntroAfter: "外掛安裝。",
			installSteps: [
				["開啟 Obsidian 設定並前往", "Community plugins", "。"],
				["關閉 Safe mode，然後點擊", "Browse", "。"],
				["搜尋並安裝", "BRAT", "，然後啟用它。"],
				["開啟 BRAT 設定，點擊", "Add Beta plugin", "。"],
				["輸入儲存庫 URL:"],
				["返回 Community plugins 並啟用", "Synch", "。"],
			],
			addRepositorySuffix: "並新增。",
			copyTitle: "複製到剪貼簿",
			selfHosting: {
				title: "使用自己的 Synch 伺服器",
				body: "你可以在 Cloudflare 免費帳號中建立 Synch 伺服器，並把它的位址填入 Obsidian 外掛。",
				link: "閱讀自行託管指南",
			},
		},
		pricing: {
			heading: "簡單透明的價格。",
			subheading: "免費開始同步你的 vault。",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			forever: "/ 永久",
			month: "/ 月",
			year: "/ 年",
			monthly: "月付",
			annual: "年付",
			earlyAccessBadge: "早期用戶價",
			comingSoon: "即將推出",
			features: {
				oneVault: "1 個同步 vault",
				freeStorage: "50 MB 儲存空間",
				starterStorage: "1 GB 儲存空間",
				freeFileSize: "最大檔案 3 MB",
				starterFileSize: "最大檔案 5 MB",
				freeHistory: "1 天版本記錄",
				starterHistory: "1 個月版本記錄",
			},
		},
		blog: {
			heading: "部落格",
			empty: "尚未新增部落格文章。",
			dateLocale: "zh-TW",
		},
		billing: {
			heading: "正在確認訂閱",
			message: "正在套用你的訂閱。通常只需要幾秒鐘。",
			continue: "繼續前往 Vaults",
			fallback: "仍在等待付款確認。你可以先繼續，稍後再重新整理。",
		},
		billingSettings: {
			eyebrow: "帳單",
			heading: "管理訂閱",
			subheading: "查看目前方案，並開啟帳單入口網站來變更或取消訂閱。",
			loading: "正在載入帳單狀態...",
			currentPlan: "目前方案",
			renewal: "續訂",
			endsOn: "結束於",
			freePlan: "Sync Free",
			starterPlan: "Sync Starter",
			monthly: "月付",
			annual: "年付",
			freeInterval: "免費",
			canceling: "將取消",
			canceled: "已取消",
			noRenewalDate: "無預定續訂",
			activeMessage: "你的訂閱處於有效狀態。可開啟帳單入口網站變更方案、取消訂閱或更新付款資訊。",
			cancelingMessage: "你的訂閱將在目前帳單週期結束時取消。",
			canceledMessage: "你的訂閱已取消。目前方案為免費。",
			freeMessage: "你目前使用免費方案。需要更多儲存空間時可以升級。",
			manage: "管理訂閱",
			upgrade: "查看方案",
			authRequired: "請登入以查看和管理訂閱。",
			signIn: "登入",
			error: "無法載入帳單資訊。請稍後重試。",
			retry: "重試",
		},
	},
} as const;
