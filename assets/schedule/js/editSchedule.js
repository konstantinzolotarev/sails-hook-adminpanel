class EditSchedule {
  constructor(config) {
    this.elName = config.element;
    this.field = config.field;
    this.dataInput = config.data;
    this.counter = 0;
    this.propertyList = {
      item: {
        type: "string",
        title: "Item",
        description: "this is the Item",
      },
      title: {
        type: "string",
        title: "Title",
        description: "this is the title",
        required: "true",
      },
      checkmark: {
        type: "boolean",
        title: "Checkmark",
        description: "this is the checkmark",
      },
      hint: {
        type: "string",
        title: "Hint",
        description: "this is the hint",
      },
      link: {
        type: "string",
        title: "Link",
        description: "this is the link",
      },
      age: {
        type: "number",
        title: "Age",
        description: "this is the age",
      },
    };
    this.permutations = {
      time: true,
      date: true,
      break: true,
      options: true,
    };

    this.main(this);
  }

  main(schedule) {

    console.log("Here")
    // add main hint
    $(`#form-${this.field}`).before(
      '<div class="admin-panel__title">\n' +
        "   Настройки показа\n" +
        '   <a href="javascript:void(0)" role="tooltip" aria-haspopup="true" class="tooltip tooltip-md tooltip-top-right">\n' +
        '   <i class="fas fa-info-circle"></i>\n' +
        '   <span class="tooltip-content">Действие определяется через вкл\\выкл. <img class="tooltip-checkbox" src="../../assets/new_layout/img/sprite/checkbox.svg" alt="##"><br> По умолчанию действие вкл припервом совпадении даты и времени</span>\n' +
        "   </a>\n" +
        "   </div>"
    );

    // add schedule-content
    $(`#form-${this.field}`).before('<ul class="schedule-content"></ul>');

    // make schedules sortable
    $(".schedule-content").sortable({
      update: function () {
        schedule.saveChanges();
      },
      start: function (e, ui) {
        ui.placeholder.height(ui.item.height()/4);
        ui.placeholder.css("visibility", "visible");
        ui.placeholder.css("background", "#ddd");
      },
    });

    // create existing schedules
    if ($(`#form-${this.field}`).val()) {
      let dataInput = JSON.parse(this.dataInput);
      for (let i = 0; i < dataInput.length; i++) {
        // generating schedule frames
        $(".schedule-content").append(this.getschedule());

        // choosing options
        if (!this.permutations.options) {
          $(".popUpButton").last().remove();
        } else {
          for (let [key, value] of Object.entries(dataInput[i].options)) {
            $(".schedule-wrapper").last().attr(`data-${key}`, value);
          }
        }

        // choosing days of week
        if (typeof dataInput[i].dayOfWeek === "string") {
          $(` > input[id^=${dataInput[i].dayOfWeek}]`, $(".schedule__content")[i]).prop("checked", "checked");
          if (dataInput[i].dayOfWeek === "all") {
            $(` > input`, $(".schedule__content")[i]).prop("checked", "checked");
          }
        } else {
          for (let j = 0; j < dataInput[i].dayOfWeek.length; j++) {
            $(` > input[id^=${dataInput[i].dayOfWeek[j]}]`, $(".schedule__content")[i]).prop("checked", "checked");
          }
        }

        // choosing time
        if (!this.permutations.time) {
          $(".add_schedule__time").last().remove();
        } else {
          if (dataInput[i].timeStart && dataInput[i].timeStop) {
            let timeStart = dataInput[i].timeStart || "";
            let timeStop = dataInput[i].timeStop || "";
            $(".add_schedule__time")
                .last()
                .replaceWith(
                    '<div class="schedule__time time_schedule">' +
                    '<label for="">от</label>' +
                    "<span>" +
                    `<input type="time" value="${timeStart}">` +
                    "</span>" +
                    '<label for="">до</label>' +
                    "<span>" +
                    `<input type="time" value="${timeStop}">` +
                    "</span>" +
                    '<button type="button" class="schedule__close delete-time">' +
                    '<i class="fas fa-times"></i>' +
                    "</button>" +
                    "</div>"
                );
          }
        }

        // choosing date
        if (!this.permutations.date) {
          $(".add_schedule__date").last().remove();
        } else {
          if (dataInput[i].dateStart && dataInput[i].dateStop) {
            let dateStart = dataInput[i].dateStart || "";
            let dateStop = dataInput[i].dateStop || "";
            $(".add_schedule__date")
                .last()
                .replaceWith(
                    '<div class="schedule__time schedule__time--date date_schedule">' +
                    '<label for="">от</label>' +
                    "<span>" +
                    `<input type="date" value="${dateStart}">` +
                    '<i class="fas fa-chevron-down"></i>' +
                    "</span>" +
                    '<label for="">до</label>' +
                    "<span>" +
                    `<input type="date" value="${dateStop}">` +
                    '<i class="fas fa-chevron-down"></i>' +
                    "</span>" +
                    '<button type="button" class="schedule__close delete-date">' +
                    '<i class="fas fa-times"></i>' +
                    "</button>" +
                    "</div>"
                );
          }
        }

        // choosing break
        if (!this.permutations.break) {
          $(".add_schedule__break").last().remove();
        } else {
          if (dataInput[i].break) {
            let [breakStart, breakStop] = dataInput[i].break.split("-");
            $(".add_schedule__break")
                .last()
                .replaceWith(
                    '<div class="schedule__time break_schedule">' +
                    '<label for="">от</label>' +
                    "<span>" +
                    `<input type="time" value="${breakStart}">` +
                    "</span>" +
                    '<label for="">до</label>' +
                    "<span>" +
                    `<input type="time" value="${breakStop}">` +
                    "</span>" +
                    '<button type="button" class="schedule__close delete-break">' +
                    '<i class="fas fa-times"></i>' +
                    "</button>" +
                    "</div>"
                );
          }
        }
        this.counter++;
      }
    }

    // handler for change event
    $("input").change(function () {
      schedule.saveChanges();
    });

    // handlers for schedules
    $(".schedule-content").on("click", ".itemDown", function () {
      schedule.itemDown(this);
    });
    $(".schedule-content").on("click", ".itemUp", function () {
      schedule.itemUp(this);
    });
    $(".schedule-content").on("click", ".delete-schedule", function () {
      schedule.deleteschedule(this);
    });
    $(".schedule-content").on("click", ".delete-time", function () {
      schedule.deleteTime(this);
    });
    $(".schedule-content").on("click", ".delete-date", function () {
      schedule.deleteDate(this);
    });
    $(".schedule-content").on("click", ".delete-break", function () {
      schedule.deleteBreak(this);
    });
    $(".schedule-content").on("click", ".add_schedule__time", function () {
      schedule.addTime(this, schedule);
    });
    $(".schedule-content").on("click", ".add_schedule__date", function () {
      schedule.addDate(this, schedule);
    });
    $(".schedule-content").on("click", ".add_schedule__break", function () {
      schedule.addBreak(this, schedule);
    });

    // add add-schedule button
    $(`#form-${this.field}`).before('<button type="button" class="schedule-add">' + '   <i class="fas fa-plus"></i>' + "</button>");

    // add handler for add-button
    $(".schedule-add").on("click", function () {
      schedule.addschedule(schedule);
    });

    // create modal window, append it and hide
    let modal =
      '<div class="modal fade" id="popUp">' +
      '<div class="modal-dialog modal-dialog-centered" role="dialog">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      "Options" +
      "</div>" +
      '<div class="modal-body">' +
      "<div>" +
      '<label for="propertyAdder">Add option</label>' +
      '<select class="form-select" id="propertyAdder" aria-label="Default select example">' +
      "</select>" +
      '<a class="addProperty" href="#">Add</a>' +
      "</div>" +
      "</div>" +
      '<div class="modal-footer">' +
      '<a class="editItem btn btn-success" data-dismiss="modal" itemid="" href="#">Save</a>' +
      '<a class="close-btn btn btn-danger" data-dismiss="modal" href="#">Cancel</a>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
    $(`#form-${this.field}`).after(modal);
    $("#popUp").hide();

    // handlers for modal window
    $(".schedule-content").on("click", ".popUpOpen", function () {
      schedule.fillPopUp(this);
    });
    $("#popUp").on("click", ".addProperty", function () {
      schedule.addProperty();
    });
    $("#popUp").on("click", ".deleteProp", function () {
      schedule.deleteProp(this);
    });
    $("#popUp").on("click", ".editItem", function () {
      schedule.editItem(schedule);
    });
    $(".close-btn").on("click", function () {
      schedule.clearPopup();
    });

    // add closing modal window using click and esc
    $(document).keydown(function (e) {
      if (e.keyCode === 27) {
        e.stopPropagation();
        schedule.clearPopup();
      }
    });
    $(".modal").click(function (e) {
      if ($(e.target).closest(".modal-body").length === 0) {
        schedule.clearPopup();
      }
    });

    // getAttr() creates jquery method .getAttr(), that gives an object with attributes and their values
    this.getAttr();
  }

  itemDown(button) {
    let currentItem = $(button).closest(".schedule-wrapper");
    let nextItem = $(currentItem).next();

    if (nextItem && nextItem.length > 0) {
      $(currentItem).insertAfter($(nextItem));
    }
    this.saveChanges();
  }

  itemUp(button) {
    let currentItem = $(button).closest(".schedule-wrapper");
    let prevItem = $(currentItem).prev(); // returns prev item or empty jQuery object

    if (prevItem && prevItem.length > 0) {
      $(currentItem).insertBefore($(prevItem));
    }
    this.saveChanges();
  }

  addschedule(schedule) {
    $(".schedule-content").append(schedule.getschedule());

    console.log(this.permutations);
    if (!this.permutations.options) {
      $(".popUpButton").last().remove();
    }
    if (!this.permutations.time) {
      $(".add_schedule__time").last().remove();
    }
    if (!this.permutations.date) {
      $(".add_schedule__date").last().remove();
    }
    if (!this.permutations.break) {
      $(".add_schedule__break").last().remove();
    }

    this.counter++;
    $(".schedule__content > input").change(function () {
      schedule.saveChanges();
    });
    this.saveChanges();
  }

  deleteschedule(button) {
    $(button).closest(".schedule-wrapper").remove();
    this.saveChanges();
  }

  addTime(button, schedule) {
    $(button).replaceWith(
      '<div class="schedule__time time_schedule">' +
        '<label for="">от</label>' +
        "<span>" +
        `<input type="time" value="">` +
        "</span>" +
        '<label for="">до</label>' +
        "<span>" +
        `<input type="time" value="">` +
        "</span>" +
        '<button type="button" class="schedule__close delete-time">' +
        '<i class="fas fa-times"></i>' +
        "</button>" +
        "</div>"
    );
    $('.time_schedule > span > input[type="time"]').change(function () {
      schedule.saveChanges();
    });
    this.saveChanges();
  }

  addDate(button, schedule) {
    $(button).replaceWith(
      '<div class="schedule__time schedule__time--date date_schedule">' +
        '<label for="">от</label>' +
        "<span>" +
        `<input type="date" value="">` +
        '<i class="fas fa-chevron-down"></i>' +
        "</span>" +
        '<label for="">до</label>' +
        "<span>" +
        `<input type="date" value="">` +
        '<i class="fas fa-chevron-down"></i>' +
        "</span>" +
        '<button type="button" class="schedule__close delete-date">' +
        '<i class="fas fa-times"></i>' +
        "</button>" +
        "</div>"
    );
    $('.date_schedule > span > input[type="date"]').change(function () {
      schedule.saveChanges();
    });
    this.saveChanges();
  }

  addBreak(button, schedule) {
    $(button).replaceWith(
      '<div class="schedule__time break_schedule">' +
        '<label for="">от</label>' +
        "<span>" +
        `<input type="time" value="">` +
        "</span>" +
        '<label for="">до</label>' +
        "<span>" +
        `<input type="time" value="">` +
        "</span>" +
        '<button type="button" class="schedule__close delete-break">' +
        '<i class="fas fa-times"></i>' +
        "</button>" +
        "</div>"
    );
    $('.break_schedule > span > input[type="time"]').change(function () {
      schedule.saveChanges();
    });
    this.saveChanges();
  }

  deleteTime(button) {
    $(button)
      .parent()
      .replaceWith('<button type="button" class="add_schedule__time">' + '<span><i class="fas fa-plus"></i>Добавить время</span></button>');
    this.saveChanges();
  }

  deleteDate(button) {
    $(button)
      .parent()
      .replaceWith('<button type="button" class="add_schedule__date">' + '<span><i class="fas fa-plus"></i>Добавить дату</span></button>');
    this.saveChanges();
  }

  deleteBreak(button) {
    $(button)
      .parent()
      .replaceWith('<button type="button" class="add_schedule__break">' + '<span><i class="fas fa-plus"></i>Добавить перерыв</span></button>');
    this.saveChanges();
  }

  saveChanges() {
    let scheduleList = [];
    for (let i = 0; i < $(".schedule-content").children().length; i++) {
      let container = {};

      // dayOfWeek
      let daysOfWeek = [];
      $(" > input", $(".schedule__content")[i]).each(function (index, element) {
        if ($(element).prop("checked") === true) {
          let day = $(element).attr("id");
          daysOfWeek.push(day.substring(0, day.indexOf("day") + 3));
        }
      });
      if (daysOfWeek.length === 1) {
        daysOfWeek = daysOfWeek[0];
      } else if (daysOfWeek.length === 7) {
        daysOfWeek = "all";
      }
      container.dayOfWeek = daysOfWeek;

      // time
      let timeStart = "";
      let timeStop = "";
      let times = $(" > .time_schedule > span > input", $(".schedule__nav")[i]);
      if (times && times.length > 0) {
        timeStart = $(times[0]).val();
        timeStop = $(times[1]).val();
      }
      container.timeStart = timeStart;
      container.timeStop = timeStop;

      // date
      let dateStart = "";
      let dateStop = "";
      let dates = $(" > .date_schedule > span > input", $(".schedule__nav")[i]);
      if (dates && dates.length > 0) {
        dateStart = $(dates[0]).val();
        dateStop = $(dates[1]).val();
      }
      container.dateStart = dateStart;
      container.dateStop = dateStop;

      // break
      let breakTime = "";
      let breaks = $(" > .break_schedule > span > input", $(".schedule__nav")[i]);
      if (breaks && breaks.length > 0) {
        breakTime = [$(breaks[0]).val(), $(breaks[1]).val()].join("-");
      }
      container.break = breakTime;

      // options
      let options = {};
      let attrs = $($(".schedule-wrapper")[i]).getAttr();
      for (let [key, value] of Object.entries(attrs)) {
        if (key.startsWith("data-")) {
          options[key.slice(5)] = value;
        }
      }
      container.options = options;

      scheduleList.push(container);
    }
    console.log(scheduleList);
    $(`#form-${this.field}`).val(JSON.stringify(scheduleList));
  }

  fillPopUp(button) {
    let currentItem = $(button).closest(".schedule-wrapper");
    let attributes = $(currentItem).getAttr(); // getAttr() gives an object with attributes and their values
    let itemId;
    for (let [key, value] of Object.entries(attributes)) {
      if (key === "id") {
        itemId = value;
        $(".editItem").attr("itemid", value);
      } else if (key.startsWith("data-")) {
        let typeRecognition = this.recognizeType(key.slice(5));
        let capitalizedKey = key.slice(5).charAt(0).toUpperCase() + key.slice(6);
        $("#propertyAdder")
          .parent()
          .before(`<div id="${key}">` + `<label for="item${capitalizedKey}">${capitalizedKey}</label>` + `<input type=${typeRecognition.inputType} id="item${capitalizedKey}">` + '<a href="#" class="deleteProp">[X]</a>' + "</div>");
        if (typeRecognition.inputType === "checkbox") {
          if (value === "true") {
            $(`#${key} > input`).prop("checked", "checked");
          }
        } else {
          $(`#${key} > input`).attr("value", value);
        }
      }
    }
    $("#propertyAdder").append(
      $("<option>", {
        value: "None",
        text: "None",
      })
    );
    let proposedList = {};
    for (let [item, value] of Object.entries(this.propertyList)) {
      let unique = true;
      for (let key of Object.keys($("#" + itemId).getAttr())) {
        if (`data-${item}` === key) {
          unique = false;
          break;
        }
      }
      if (unique === true) {
        proposedList[item] = value;
      }
    }
    for (let [item, value] of Object.entries(proposedList)) {
      $("#propertyAdder").append(
        $("<option>", {
          value: item,
          text: value.title,
        })
      );
    }
  }

  clearPopup() {
    $('.modal-body > div[id^="data-"]').remove();
    $("#propertyAdder").empty();
  }

  addProperty() {
    if ($("#propertyAdder").val() !== "None") {
      let typeRecognition = this.recognizeType($("#propertyAdder").val());
      let capitalizedKey = $("#propertyAdder").val().charAt(0).toUpperCase() + $("#propertyAdder").val().slice(1);
      $("#propertyAdder")
        .parent()
        .before(`<div id="data-${$("#propertyAdder").val()}">` + `<label for="item${capitalizedKey}">${capitalizedKey}</label>` + `<input type=${typeRecognition.inputType} id="item${capitalizedKey}">` + '<a href="#" class="deleteProp">[X]</a>' + "</div>");
      $("#" + $(".editItem").attr("itemid")).attr(`data-${$("#propertyAdder").val()}`, typeRecognition.defaultValue);
      $("#propertyAdder option:selected").remove();
      this.saveChanges();
    }
  }

  recognizeType(inputValue) {
    let output = {
      inputType: "",
      defaultValue: "",
    };
    for (let [key, value] of Object.entries(this.propertyList)) {
      if (inputValue === key) {
        switch (value.type) {
          case "string":
            output.inputType = "text";
            output.defaultValue = "";
            break;
          case "number":
            output.inputType = "number";
            output.defaultValue = 0;
            break;
          case "boolean":
            output.inputType = "checkbox";
            output.defaultValue = "false";
            break;
        }
      }
    }
    return output;
  }

  deleteProp(prop) {
    $("#" + $(".editItem").attr("itemid")).removeAttr($(prop).parent().attr("id"));
    $(prop).parent().hide();
    this.saveChanges();
  }

  editItem(schedule) {
    let itemId = "#" + $(".editItem").attr("itemid");
    $(".modal-body > div").each(function (index, element) {
      if ($(element).is(":visible") && $(element).attr("id")) {
        if (schedule.recognizeType($(element).attr("id").slice(5)).inputType === "checkbox") {
          $(itemId).attr($(element).attr("id"), $(" > input", element).prop("checked"));
        } else {
          $(itemId).attr($(element).attr("id"), $(" > input", element).val());
        }
      }
    });
    this.saveChanges();
    this.clearPopup();
  }

  getschedule() {
    return (
      `<li class="schedule-wrapper" id="schedule${this.counter}">` +
      '<div class="schedule">' +
      '<div class="schedule__form">' +
      '<div class="schedule__wrap">' +
      '<button type="button" class="schedule__dots">' +
      '<i class="fas fa-ellipsis-v"></i>' +
      "</button>" +
      '<div class="schedule__content">' +
      `<input type="checkbox" id="monday${this.counter}">` +
      `<label for="monday${this.counter}">` +
      "пн" +
      "</label>" +
      `<input type="checkbox" id="tuesday${this.counter}">` +
      `<label for="tuesday${this.counter}">` +
      "вт" +
      "</label>" +
      `<input type="checkbox" id="wednesday${this.counter}">` +
      `<label for="wednesday${this.counter}">` +
      "ср" +
      "</label>" +
      `<input type="checkbox" id="thursday${this.counter}">` +
      `<label for="thursday${this.counter}">` +
      "чт" +
      "</label>" +
      `<input type="checkbox" id="friday${this.counter}">` +
      `<label for="friday${this.counter}">` +
      "пт" +
      "</label>" +
      `<input type="checkbox" id="saturday${this.counter}">` +
      `<label for="saturday${this.counter}">` +
      "сб" +
      "</label>" +
      `<input type="checkbox" id="sunday${this.counter}">` +
      `<label for="sunday${this.counter}">` +
      "вс" +
      "</label>" +
      "</div>" +
      '<button type="button" class="schedule__close delete-schedule">' +
      '<i class="fas fa-times"></i>' +
      "</button>" +
      "</div>" +
      '<div class="schedule__nav">' +
      '<button type="button" class="add_schedule__time">' +
      '<span><i class="fas fa-plus"></i>Добавить время</span></button>' +
      '<button type="button" class="add_schedule__date">' +
      '<span><i class="fas fa-plus"></i>Добавить дату</span></button>' +
      '<button type="button" class="add_schedule__break">' +
      '<span><i class="fas fa-plus"></i>Добавить перерыв</span></button>' +
      "</div>" +
      '<div class="schedule__bottom">' +
      '<div class="schedule__arrows">' +
      '<button type="button" class="schedule__arrow itemDown">' +
      '<i class="fas fa-chevron-down"></i>' +
      "</button>" +
      '<button type="button" class="schedule__arrow itemUp">' +
      '<i class="fas fa-chevron-up"></i>' +
      "</button>" +
      "</div>" +
      '<div class="popUpButton">' +
      '<button type="button" class="schedule__arrow popUpOpen" data-toggle="modal" data-target="#popUp">' +
      "<i>{}</i>" +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</li>"
    );
  }

  getAttr() {
    $.fn.getAttr = function () {
      if (arguments.length === 0) {
        if (this.length === 0) {
          return null;
        }

        var obj = {};
        $.each(this[0].attributes, function () {
          if (this.specified) {
            obj[this.name] = this.value;
          }
        });
        return obj;
      }

      return $.fn.attr.apply(this, arguments);
    };
    return $.fn.getAttr;
  }
}