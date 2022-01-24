export const profile = {
    id: 444444,
    email: "dummylolosh@gmail.com",
}

export const settings = {
    launchScreen: "Home",
    currency: "USD",
    appearance: "Dark",
    language: "English",
}

export const holdings = [
    {
        id: "bitcoin",
        qty: 1,
        average_price: 66000
    },
    {
        id: "ethereum",
        qty: 500,
        average_price: 1700
    },
    {
        id: "dogecoin",
        qty: 1000,
        average_price: 0.1
    }
]

export const following = [
    {
        id: "bit",
        qty: 44
    },
    {
        id: "eth",
        qty: 662
    },
    {
        id: "gme",
        qty: 234623
    },
]

const dummyData = {
    profile,
    settings,
    following,
    holdings,
};

export default dummyData;