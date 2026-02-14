export default async function handler(req, res) {
    const { code } = req.query

    if (!code) {
        return res.status(400).json({ error: '缺少基金代码' })
    }

    const url = `http://fundgz.1234567.com.cn/js/${code}.js?_=${Date.now()}`

    try {
        const response = await fetch(url, {
            headers: {
                'Referer': 'http://fund.eastmoney.com/',
                'User-Agent': 'Mozilla/5.0'
            }
        })

        const text = await response.text()

        // 去掉 jsonp 包装：jsonpgz({...})
        const json = JSON.parse(text.replace(/^jsonpgz\((.*)\)$/, '$1'))

        return res.json(json)
    } catch (err) {
        return res.status(500).json({ error: '接口请求失败' })
    }
}
