import requests
from bs4 import BeautifulSoup
import shutil
import json


def hex_to_rgb(value):
    value = value.lstrip('#')
    lv = len(value)
    return tuple(int(value[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))


def bestTextColorForBg(bg):
    luminance = (0.299 * bg[0] + 0.587*bg[1] + 0.114 * bg[2]) / 255
    return "white" if luminance < 0.5 else "black"


url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'


def getCompanies():
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    # headerTds = soup.select("#constituents th")
    # headers = []
    # for td in headerTds:
    #     headers.append(td.text.strip())
    trs = soup.select("#constituents tbody tr")
    companies = []
    for i, tr in enumerate(trs):
        if i == 0:
            continue
        # if i == 100:
        #     break
        company = {}
        for j, td in enumerate(tr.select("td")):
            if j == 0:
                company["symbol"] = td.text.strip()
            elif j == 1:
                company["name"] = td.text.strip()
                break

        tradingViewUrl = "https://www.tradingview.com/symbols/{}".format(
            company["symbol"])

        webPage = requests.get(tradingViewUrl)
        soup2 = BeautifulSoup(webPage.content, 'html.parser')
        try:
            imageUrl = soup2.select_one(".tv-circle-logo--large")["src"]
        except Exception as e:
            print(e)
            continue

        r = requests.get(imageUrl, stream=True)
        if r.status_code == 200:
            r.raw.decode_content = True
            filename = "../public/companyLogos/{}.svg".format(
                company["symbol"])
            with open(filename, 'wb') as f:
                shutil.copyfileobj(r.raw, f)
            print('Image sucessfully Downloaded: ', company["symbol"])
            with open(filename, "r") as f:
                svg = f.read()
                try:
                    color = svg.split('path fill="')[1][:7]
                    rgb = hex_to_rgb(color)
                except:
                    color = "#000000"
                    rgb = (0, 0, 0)
                print(color)
                company["backgroundColor"] = color
                company["textColor"] = bestTextColorForBg(rgb)

        else:
            print('Image Couldn\'t be retreived: ',
                  company["symbol"], imageUrl)

        companies.append(company)
    return companies


companies = getCompanies()
with open("./companies.js", "w") as f:
    f.write("const companies = {};\n export default companies;".format(
        json.dumps(companies)))
print(companies)
