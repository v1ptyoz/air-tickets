export default class Service {
    url = "https://front-test.beta.aviasales.ru/";
    id = "";
    setId = async () => {
        const response = await this.fetchData(this.url + "search");
        this.id = response.searchId;
    }
    getTickets = async () => {
        return await this.fetchData(this.url + `tickets?searchId=${this.id}`)
    }
    fetchData = async (url) => {
        let response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            return this.fetchData(url);
        }
    }
}
