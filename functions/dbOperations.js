
exports.addItems = async function addItems(item) {
    const item1 = new item({title: "Welcome to To-do List"})
    const item2 = new item({title: "Add items by pressing +"})
    const item3 = new item({title: "<-- Press to mark as done"})

    await item.insertMany([item1, item2, item3]).then(res => {
        console.log("Added default items!")
    }).catch (err => {
        console.log("Some error occured: " + err.name);
    })
}

exports.insertItem = async function insertItem(model, item) {
    await model.insertMany(item).then(res => {
        console.log("Added item successfully!");
    }).catch (err => {
        console.log("Error is: ")
        console.log(err.name)
        console.log(err.msg)
    })
}
