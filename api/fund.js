export default async function handler(req, res) {
    const { code } = req.query

    if (!code) {
        return res.status(400).json({ error: '缺少基金代码' })
    }

    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=1&_=${Date.now()}`

    try {
        const response = await fetch(url, {
            headers: {
                'Referer': 'https://fund.eastmoney.com/',
                'User-Agent': 'Mozilla/5.0'
            }
        })

        const text = await response.text()

        const json = JSON.parse(text.replace(/^[^(]+\((.*)\)$/, '$1'))

        const row = json?.Data?.LSJZList?.[0]

        if (!row) {
            return res.json({ code, error: '无数据' })
        }

        return res.json({
            code,
            date: row.FSRQ,
            nav: row.DWJZ,
            changeRate: row.JZZZL + '%'
        })
    } catch (err) {
        return res.status(500).json({ error: '接口请求失败' })
    }
}
