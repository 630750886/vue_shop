import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Aside,Main,Header,Menu,MenuItem,Submenu ,
Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Pagination,Tooltip,Dialog,MessageBox,
Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Step,Steps,Checkbox,CheckboxGroup,Upload} from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Aside).use(Main).use(Header).
use(Menu).use(MenuItem).use(Submenu).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).
use(Table).use(TableColumn).use(Switch).use(Pagination).use(Tooltip).use(Dialog).use(Tag).use(Tree).
use(Select).use(Option).use(Cascader).use(Alert).use(Tabs).use(TabPane).use(Step).use(Steps).use(Checkbox).
use(CheckboxGroup).use(Upload)

//挂载massage组件
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
