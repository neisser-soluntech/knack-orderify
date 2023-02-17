function code(Soluntech){
  console.log('HELLOOO WORLDDD IT WORKSSSS!!! HI JAIME again veamos si funciona')
  const lib = new Soluntech({
    applicationID: atob(atob('TmpKbE9USmpNRFJpTlRGak9UUXdNREl5WTJJd1kyUTQ=')),
    restAPIkey: atob(atob('WW1ReFlURXhaVEV0WVdReU1pMDBOV0kwTFRoak9HRXROMk0yT1RGbU5tVmtZemN4')),
    environment: 'development'
  });

lib.set('OBJECTS_ID', {
    orders: 'object_2',
    orderDetails: 'object_6'
});

// 1. Logic to create a new Order Detail via API (create)
// lib.addTask('renderView', 'knack-view-render.view_64', function (e, v) {
//     const form = $('#view_64 form');
//     const btn = form.find('button:submit');

//     btn.click( async function(e) {
//         e.preventDefault();
//         try {
//           const arr = createArray(100);
//           const promises = arr.map(item => lib.create(lib.OBJECTS_ID.orders, JSON.stringify(item)));
//           await Promise.all(promises)
//           Knack.closeModal(); 
//         } catch (err) {
//            alert('an error have occurrs, please submit again', err)
//         }
//     });
// });

lib.addTask('renderView', 'knack-view-render.view_68', function (e, v) {
  const btn = $('#view_68 div a');
  btn.click( async function(e) {
      e.preventDefault();
      const data = await lib.find(lib.OBJECTS_ID.orderDetails,[{field: 'field_37',operator:'is',value: Knack.models.view_50.attributes.id}]);
      
      const updates = data.records.map(i=>{
        return new Promise((resolve, reject)=>{
          console.log(i)
          lib.update(lib.OBJECTS_ID.orderDetails,i.id,JSON.stringify({
            field_38: 2
          }))
          .then(r=>resolve(r));
        });
      });

      const updated = await Promise.all(updates)
      console.log(updated)
  });
});

// 4. Logic to duplicate an Order (find + create)
lib.addTask('renderView', 'knack-view-render.view_66', function (e, v) {
  const form = $('#view_66 form');
  const btn = form.find('button:submit');
  btn.click( async function (e) {
    e.preventDefault();

    const order = await lib.findById(lib.OBJECTS_ID.orders, Knack.models.view_65.attributes.id);
    console.log({order})
    const orderMapped = mapOrder(order)
    const cleanedOrder = cleanRaw(orderMapped)
    
    console.log(cleanedOrder)
    
    const duplicatedOrder = await lib.create(lib.OBJECTS_ID.orders, JSON.stringify(cleanedOrder));

    console.log(order)

    const orderDetails = await lib.find(lib.OBJECTS_ID.orderDetails,[{field: 'field_37',operator:'is',value: Knack.models.view_65.attributes.id}]);
    console.log({orderDetails})
    const details = orderDetails.records.map(orderDetail=>{
      return duplicateOrderDetail(orderDetail)
    });

    // duplicate order details
    await Promise.all(details)

    Knack.closeModal();
  })
});

  // 5. Logic to delete an Order in cascade (delete)
  lib.addTask('renderView', 'knack-view-render.view_72', function (e, v) {
    const form = $('#view_72 form');
    const btn = form.find('button:submit');
    btn.click( async function (e) {
      e.preventDefault();
      
      const data = await lib.find(lib.OBJECTS_ID.orderDetails,[{field: 'field_37',operator:'is',value: Knack.models.view_71.attributes.id}]);
      
      const deletes = data.records.map(i=>{
        return new Promise((resolve, reject)=>{
          console.log(i)
          lib.delete(lib.OBJECTS_ID.orderDetails,i.id)
          .then(r=>resolve(r));
        });
      });

      // delete order details
      await Promise.all(deletes)

      // delete order
      await lib.delete(lib.OBJECTS_ID.orders, Knack.models.view_71.attributes.id);

      Knack.closeModal(); 
    })
  });
}
